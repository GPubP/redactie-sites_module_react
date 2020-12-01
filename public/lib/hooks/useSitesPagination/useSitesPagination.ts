import { PaginationResponse } from '@datorama/akita';
import { usePrevious } from '@redactie/utils';
import { equals } from 'ramda';
import { useEffect, useState } from 'react';
import { combineLatest, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { SearchParams } from '../../services/api';
import { SiteResponse } from '../../services/sites';
import { sitesFacade, sitesPaginator } from '../../store/sites';

import { UseSitesPagination } from './useSitesPagination.types';
const subject = new Subject<SearchParams>();
const searchParamsObservable = subject.asObservable();
let previousPage: number;

const useSitesPagination: UseSitesPagination = (sitesSearchParams, clearCache = false) => {
	const [pagination, setPagination] = useState<PaginationResponse<SiteResponse> | null>(null);
	const prevSitesSearchParams = usePrevious<SearchParams>(sitesSearchParams);

	useEffect(() => {
		const s = combineLatest(sitesPaginator.pageChanges, searchParamsObservable)
			.pipe(
				filter(([page, searchParams]) => page === searchParams.page),
				tap(([page]) => {
					if (previousPage !== page) {
						// Don't show a loading indicator when we refresh the current page
						sitesFacade.setIsFetching(true);
					}
					previousPage = page;
				}),
				switchMap(([, searchParams]) =>
					sitesPaginator.getPage(() => sitesFacade.getSitesPaginated(searchParams))
				)
			)
			.subscribe(result => {
				if (result) {
					setPagination(result);
					sitesFacade.setIsFetching(false);
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

		if (sitesSearchParams.page !== prevSitesSearchParams?.page) {
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

	return [pagination, sitesPaginator.refreshCurrentPage.bind(sitesPaginator)];
};

export default useSitesPagination;
