import { useObservable } from '@mindspace-io/react';

import { SiteResponse } from '../../services/sites/sites.service.types';
import { LoadingState } from '../../sites.types';
import { sitesFacade } from '../../store/sites/sites.facade';

const useSite = (): [LoadingState, SiteResponse | undefined] => {
	const [loading] = useObservable(sitesFacade.isFetching$, null);
	const [site] = useObservable(sitesFacade.site$, sitesFacade.getSiteValue());
	const [error] = useObservable(sitesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading || LoadingState.Loading;

	return [loadingState, site];
};

export default useSite;
