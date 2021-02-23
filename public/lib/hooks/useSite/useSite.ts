import { LoadingState, useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { SiteModel } from '../../store/sites';
import { sitesFacade } from '../../store/sites/sites.facade';

import { UseSite } from './useSite.types';

const useSite: UseSite = (siteId: string) => {
	const [site, setSite] = useState<SiteModel>();

	useEffect(() => {
		if (!siteId) {
			return;
		}

		const hasSite = sitesFacade.hasSite(siteId);

		if (!hasSite) {
			sitesFacade.getSite({ id: siteId });
		}

		const siteSubscription = sitesFacade.selectSite(siteId).subscribe(setSite);

		return () => {
			siteSubscription.unsubscribe();
		};
	}, [siteId]);

	const loading = useObservable(sitesFacade.isFetchingOne$, null);
	const error = useObservable(sitesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading || LoadingState.Loading;

	return [loadingState, site];
};

export default useSite;
