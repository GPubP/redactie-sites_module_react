import { useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { SiteDetailUIModel, sitesFacade } from '../../store/sites';

import { UseSitesUIStates } from './useSitesUIStates.types';

const useSitesUIStates: UseSitesUIStates = siteId => {
	const siteUIState = useObservable(sitesFacade.listUIState$, {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const [siteDetailUIState, setSiteDetailUIState] = useState<SiteDetailUIModel>();

	useEffect(() => {
		const s = sitesFacade.selectSiteUIState(siteId).subscribe(setSiteDetailUIState);

		return () => {
			s.unsubscribe();
		};
	}, [siteId]);

	return [siteUIState, siteDetailUIState];
};

export default useSitesUIStates;
