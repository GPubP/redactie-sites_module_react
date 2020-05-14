import { PaginationResponse } from '@datorama/akita';
import { useEffect, useState } from 'react';

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
		if (sitesSearchParams.sort !== prevSitesSearchParams?.sort || clearCache) {
			sitesPaginator.clearCache();
		}

		sitesPaginator.setPage(sitesSearchParams.page);
		const s = sitesPaginator
			.getPage(() => sitesFacade.getSitesPaginated(sitesSearchParams))
			.subscribe(result => {
				if (result) {
					setPagination(result);
				}
			});

		return () => {
			s.unsubscribe();
		};
	}, [sitesSearchParams, sitesSearchParams.page, prevSitesSearchParams, clearCache]);

	return pagination;
}

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
