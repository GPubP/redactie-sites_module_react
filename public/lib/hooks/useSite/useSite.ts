import { useObservable } from '@mindspace-io/react';

import { LoadingState } from '../../sites.types';
import { sitesFacade } from '../../store/sites/sites.facade';

const useSite = (): any => {
	const [loading] = useObservable(sitesFacade.isFetching$, LoadingState.Loaded);
	const [site] = useObservable(sitesFacade.site$, null);
	const [error] = useObservable(sitesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, site];
};

export default useSite;
