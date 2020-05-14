import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../sites.types';
import { sitesFacade } from '../../store/sites/sites.facade';

import { SitesLoadingStates } from './useSitesLoadingStates.types';

const useSitesLoadingState = (): SitesLoadingStates => {
	const [isCreating] = useObservable(sitesFacade.isCreating$, LoadingState.Loaded);
	const [isFetching] = useObservable(sitesFacade.isFetching$, LoadingState.Loaded);
	const [isUpdating] = useObservable(sitesFacade.isUpdating$, LoadingState.Loaded);
	const [isActivating] = useObservable(sitesFacade.isActivating$, LoadingState.Loaded);

	return {
		isCreating,
		isFetching,
		isUpdating,
		isActivating,
	};
};

export default useSitesLoadingState;
