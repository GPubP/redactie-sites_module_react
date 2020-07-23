import { PaginationResponse } from '@datorama/akita';
import { equals } from 'ramda';
import { useEffect, useState } from 'react';
import { first } from 'rxjs/operators';

import { usePrevious } from '../../hooks';
import { SearchParams } from '../../services/api';
import { SiteResponse } from '../../services/sites';
import { sitesFacade, sitesPaginator } from '../../store/sites';

function useSitesPagination(
	sitesSearchParams: SearchParams,
	clearCache = false
): PaginationResponse<SiteResponse> | null {
	const [pagination, setPagination] = useState<PaginationResponse<SiteResponse> | null>(null);
	const prevSitesSearchParams = usePrevious<SearchParams>(sitesSearchParams);

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

		sitesPaginator.setPage(sitesSearchParams.page);

		sitesPaginator
			.getPage(() => sitesFacade.getSitesPaginated(sitesSearchParams))
			.pipe(first())
			.subscribe(result => {
				if (result) {
					setPagination(result);
				}
			});
	}, [sitesSearchParams, prevSitesSearchParams, clearCache]);

	return pagination;
}
// TODO: check why this isn't working
// function useSitesPagination(
// 	sitesSearchParams: SearchParams,
// 	clearCache = false
// ): PaginationResponse<SiteResponse> | null {
// 	const [pagination, setPagination] = useState<PaginationResponse<SiteResponse> | null>(null);
// 	const prevSitesSearchParams = usePrevious<SearchParams>(sitesSearchParams);

// 	useEffect(() => {
// 		const shouldClearCache =
// 			sitesSearchParams.sort !== prevSitesSearchParams?.sort || clearCache;
// 		console.log(shouldClearCache, 'should clear cache');

// 		const s = sitesFacade
// 			.getSitesPaginated(sitesSearchParams, shouldClearCache)
// 			.subscribe(result => {
// 				if (result) {
// 					setPagination(result);
// 				}
// 			});

// 		return () => {
// 			s.unsubscribe();
// 		};
// 	}, [sitesSearchParams, sitesSearchParams.page, prevSitesSearchParams, clearCache]);

// 	return pagination;
// }

export default useSitesPagination;
