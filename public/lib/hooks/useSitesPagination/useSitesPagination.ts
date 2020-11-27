import { PaginationResponse } from '@datorama/akita';
import { usePrevious, useWillUnmount } from '@redactie/utils';
import { equals } from 'ramda';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { SearchParams } from '../../services/api';
import { SiteResponse } from '../../services/sites';
import { sitesFacade, sitesPaginator } from '../../store/sites';

import { UseSitesPagination } from './useSitesPagination.types';

const useSitesPagination: UseSitesPagination = (sitesSearchParams, clearCache = false) => {
	const [pagination, setPagination] = useState<PaginationResponse<SiteResponse> | null>(null);
	const prevSitesSearchParams = usePrevious<SearchParams>(sitesSearchParams);
	const [pageChangesSubscriptions, setPageChangesSubscriptions] = useState<Subscription[]>([]);

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
		const s = sitesPaginator.pageChanges
			.pipe(
				switchMap(() =>
					sitesPaginator.getPage(() => sitesFacade.getSitesPaginated(sitesSearchParams))
				),
				take(1)
			)
			.subscribe(result => {
				if (result) {
					setPagination(result);
				}
			});
		setPageChangesSubscriptions(state => [...state, s]);
	}, [sitesSearchParams, prevSitesSearchParams, clearCache]);

	useWillUnmount(() => {
		// NOTE: It is not possible to unsubscribe insinde the useEffect
		// Because by doing that we broke the subscription :(
		pageChangesSubscriptions.forEach(s => s.unsubscribe());
	});

	return [pagination, sitesPaginator.refreshCurrentPage.bind(sitesPaginator)];
};

export default useSitesPagination;
