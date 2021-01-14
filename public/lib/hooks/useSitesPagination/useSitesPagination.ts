import { PaginationResponse } from '@datorama/akita';
import { usePrevious } from '@redactie/utils';
import { equals } from 'ramda';
import { useEffect, useRef, useState } from 'react';
import { combineLatest, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { SearchParams } from '../../services/api';
import { SiteResponse } from '../../services/sites';
import { sitesFacade, sitesPaginator } from '../../store/sites';

import { UseSitesPagination } from './useSitesPagination.types';
const subject = new Subject<SearchParams>();
const searchParamsObservable = subject.asObservable();

const useSitesPagination: UseSitesPagination = (sitesSearchParams, clearCache = false) => {
	const isRefreshingPage = useRef(false);
	const [pagination, setPagination] = useState<PaginationResponse<SiteResponse> | null>(null);
	const prevSitesSearchParams = usePrevious<SearchParams>(sitesSearchParams);

	useEffect(() => {
		const s = combineLatest(sitesPaginator.pageChanges, searchParamsObservable)
			.pipe(
				filter(([page, searchParams]) => page === searchParams.page),
				tap(() => {
					if (!isRefreshingPage.current) {
						// Don't show a loading indicator when we refresh the current page
						sitesFacade.setIsFetching(true);
					}
				}),
				switchMap(([, searchParams]) =>
					sitesPaginator.getPage(() => sitesFacade.getSitesPaginated(searchParams))
				)
			)
			.subscribe(result => {
				isRefreshingPage.current = false;
				if (result) {
					setPagination(result);
					sitesFacade.setIsFetching(false);
					// NOTE: This is a hack!
					// The paginator class is not bound to the store data.
					// Updating an item in store will not change the data in the paginator
					// We need to refresh the current page to get the updated data
					// We are still updating the data when we are refreshing the page
					// Therefore we need to set the isUpdating prop to false when we fetched the data from the server
					sitesFacade.setIsUpdating(false);
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
			clearCache
		) {
			sitesPaginator.clearCache();
		}

		subject.next(sitesSearchParams);

		if (
			sitesSearchParams.page !== prevSitesSearchParams?.page &&
			sitesPaginator.currentPage !== sitesSearchParams.page
		) {
			sitesPaginator.setPage(sitesSearchParams.page);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		clearCache,
		prevSitesSearchParams,
		sitesSearchParams,
		sitesSearchParams.page,
		sitesSearchParams.search,
		sitesSearchParams.sort,
	]);

	return [
		pagination,
		() => {
			// NOTE: This is a hack!
			// The paginator class is not bound to the store data.
			// Updating an item in store will not change the data in the paginator
			// We need to refresh the current page to get the updated data
			// We are still updating the data when we are refreshing the page
			// Therefore we need to set the isUpdating prop to true
			sitesFacade.setIsUpdating(true);
			isRefreshingPage.current = true;
			sitesPaginator.refreshCurrentPage();
		},
	];
};

export default useSitesPagination;
