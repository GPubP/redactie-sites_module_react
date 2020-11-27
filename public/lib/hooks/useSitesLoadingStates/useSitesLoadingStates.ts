import { useObservable } from '@redactie/utils';

import { sitesFacade } from '../../store/sites/sites.facade';

import { UseSitesLoadingStates } from './useSitesLoadingStates.types';

const useSitesLoadingState: UseSitesLoadingStates = () => {
	const isCreating = useObservable(sitesFacade.isCreating$, null);
	const isFetching = useObservable(sitesFacade.isFetching$, null);
	const isUpdating = useObservable(sitesFacade.isUpdating$, null);
	const isActivating = useObservable(sitesFacade.isActivating$, null);
	const isArchiving = useObservable(sitesFacade.isArchiving$, null);

	return {
		isCreating,
		isFetching,
		isUpdating,
		isActivating,
		isArchiving,
	};
};

export default useSitesLoadingState;
