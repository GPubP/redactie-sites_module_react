import { useObservable } from '@mindspace-io/react';

import { sitesFacade } from '../../store/sites/sites.facade';

import { SitesLoadingStates } from './useSitesLoadingStates.types';

const useSitesLoadingState = (): SitesLoadingStates => {
	const [isCreating] = useObservable(sitesFacade.isCreating$, null);
	const [isFetching] = useObservable(sitesFacade.isFetching$, null);
	const [isUpdating] = useObservable(sitesFacade.isUpdating$, null);
	const [isActivating] = useObservable(sitesFacade.isActivating$, null);

	return {
		isCreating,
		isFetching,
		isUpdating,
		isActivating,
	};
};

export default useSitesLoadingState;
