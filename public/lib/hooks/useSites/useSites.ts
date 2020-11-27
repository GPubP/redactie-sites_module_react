import { LoadingState, useObservable } from '@redactie/utils';

import { sitesFacade } from '../../store/sites';

import { UseSites } from './useSites.types';

const useSites: UseSites = () => {
	const loading = useObservable(sitesFacade.isFetching$, LoadingState.Loading);
	const sites = useObservable(sitesFacade.sites$, []);
	const error = useObservable(sitesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, sites];
};

export default useSites;
