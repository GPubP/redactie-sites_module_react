import { PaginationResponse } from '@datorama/akita';
import { usePrevious } from '@redactie/utils';
import { equals } from 'ramda';
import { useEffect, useState } from 'react';
import { first } from 'rxjs/operators';

import { SearchParams } from '../../services/api';
import { SiteResponse } from '../../services/sites';
import { sitesFacade, sitesPaginator } from '../../store/sites';

import { UseSitesPagination } from './useSitesPagination.types';

const useSitesPagination: UseSitesPagination = (
	sitesSearchParams: SearchParams,
	clearCache = false
) => {
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
};

export default useSitesPagination;
