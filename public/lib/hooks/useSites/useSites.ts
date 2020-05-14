import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../sites.types';
import { SiteModel, SitesMetaModel } from '../../store/sites';
import { sitesFacade } from '../../store/sites/sites.facade';

const useSites = (): [LoadingState, SiteModel[], SitesMetaModel | null | undefined] => {
	// get sites observable
	const [sites] = useObservable(sitesFacade.sites$, []);
	const [meta] = useObservable(sitesFacade.meta$, null);
	const [loading] = useObservable(sitesFacade.isFetching$, LoadingState.Loaded);
	const [error] = useObservable(sitesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, sites, meta];
};

export default useSites;
