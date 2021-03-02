import { PaginationResponse } from '@datorama/akita';
import { SearchParams, useObservable, usePrevious } from '@redactie/utils';
import { equals } from 'ramda';
import { useEffect, useRef, useState } from 'react';
import { combineLatest, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { SiteResponse } from '../../services/sites';
import { sitesFacade, sitesListPaginator } from '../../store/sites';

import { UsePaginatedSites } from './usePaginatedSites.types';
const subject = new Subject<SearchParams>();
const searchParamsObservable = subject.asObservable();

const usePaginatedSites: UsePaginatedSites = (sitesSearchParams, clearCache = false) => {
	const isRefreshingPage = useRef(false);
	const [pagination, setPagination] = useState<PaginationResponse<SiteResponse> | null>(null);
	const prevSitesSearchParams = usePrevious<SearchParams>(sitesSearchParams);
	const loading = useObservable(sitesFacade.listIsFetching$, true);
	const error = useObservable(sitesFacade.listError$, null);

	useEffect(() => {
		const s = combineLatest(sitesListPaginator.pageChanges, searchParamsObservable)
			.pipe(
				filter(([page, searchParams]) => page === searchParams.page),
				tap(() => {
					if (!isRefreshingPage.current) {
						// Don't show a loading indicator when we refresh the current page
						sitesFacade.setListIsFetching(true);
					}
				}),
				switchMap(([, searchParams]) =>
					sitesListPaginator.getPage(() => sitesFacade.getSitesPaginated(searchParams))
				)
			)
			.subscribe(result => {
				isRefreshingPage.current = false;
				if (result) {
					setPagination(result);
					sitesFacade.setListIsFetching(false);
					// NOTE: This is a hack!
					// The paginator class is not bound to the store data.
					// Updating an item in store will not change the data in the paginator
					// We need to refresh the current page to get the updated data
					// We are still updating the data when we are refreshing the page
					// Therefore we need to set the isUpdating prop to false when we fetched the data from the server
					// newSitesFacade.setIsUpdating(false);
				}
			});

		return () => {
			s.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (equals(sitesSearchParams, prevSitesSearchParams)) {
			return;
		}

		if (
			sitesSearchParams.sort !== prevSitesSearchParams?.sort ||
			sitesSearchParams.search !== prevSitesSearchParams?.search ||
			sitesSearchParams.status !== prevSitesSearchParams?.status ||
			clearCache
		) {
			sitesListPaginator.clearCache();
		}

		subject.next(sitesSearchParams);

		if (
			sitesSearchParams.page !== prevSitesSearchParams?.page &&
			sitesListPaginator.currentPage !== sitesSearchParams.page
		) {
			sitesListPaginator.setPage(sitesSearchParams.page ?? 1);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		clearCache,
		prevSitesSearchParams,
		sitesSearchParams,
		sitesSearchParams.page,
		sitesSearchParams.search,
		sitesSearchParams.status,
		sitesSearchParams.sort,
	]);

	return {
		loading,
		pagination,
		refreshCurrentPage: () => {
			// NOTE: This is a hack!
			// The paginator class is not bound to the store data.
			// Updating an item in store will not change the data in the paginator
			// We need to refresh the current page to get the updated data
			// We are still updating the data when we are refreshing the page
			// Therefore we need to set the isUpdating prop to true
			// sitesFacade.setIsUpdating(true);
			isRefreshingPage.current = true;
			sitesListPaginator.refreshCurrentPage();
		},
		error,
	};
};

export default usePaginatedSites;
