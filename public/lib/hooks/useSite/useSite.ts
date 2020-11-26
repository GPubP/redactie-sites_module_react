import { LoadingState, useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { sitesFacade } from '../../store/sites/sites.facade';

import { UseSite } from './useSite.types';

const useSite: UseSite = (siteId: string) => {
	useEffect(() => {
		if (!sitesFacade.hasActive(siteId) && siteId) {
			sitesFacade.setActive(siteId);
			console.log('get site');
			sitesFacade.getSite({ id: siteId });
		}
	}, [siteId]);

	const loading = useObservable(sitesFacade.isFetching$, null);
	const site = useObservable(sitesFacade.site$);
	const error = useObservable(sitesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading || LoadingState.Loading;

	return [loadingState, site];
};

export default useSite;
