import { useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { SiteDetailUIModel, SiteListUIModel, sitesFacade } from '../../store/sites';

function useSitesUIStates<T extends string | string[]>(
	siteIds?: T
): T extends string
	? [SiteListUIModel, SiteDetailUIModel | undefined]
	: [SiteListUIModel, Record<string, SiteDetailUIModel> | undefined];
function useSitesUIStates(
	siteIds: string | string[]
):
	| [SiteListUIModel, SiteDetailUIModel | undefined]
	| [SiteListUIModel, Record<string, SiteDetailUIModel> | undefined] {
	const siteUIState = useObservable(sitesFacade.listUIState$, {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const [siteDetailUIState, setSiteDetailUIState] = useState<SiteDetailUIModel>();
	const [siteDetailUIStates, setSiteDetailUIStates] = useState<SiteDetailUIModel[]>();

	useEffect(() => {
		if (!siteIds) {
			return;
		}

		const s =
			typeof siteIds === 'string'
				? sitesFacade.selectSiteUIState(siteIds).subscribe(setSiteDetailUIState)
				: sitesFacade.selectSiteUIState(siteIds).subscribe(setSiteDetailUIStates);

		return () => {
			s.unsubscribe();
		};
	}, [siteIds]);

	if (!siteIds) {
		return [siteUIState, undefined];
	}

	if (typeof siteIds === 'string') {
		return [siteUIState, siteDetailUIState];
	}

	const siteDetailUIStatesMap = Array.isArray(siteDetailUIStates)
		? siteIds.reduce((acc, siteId) => {
				const siteDetailUIState = siteDetailUIStates.find(
					siteDetailUIState => (siteDetailUIState as any).uuid === siteId
				);

				if (!siteDetailUIState) {
					return acc;
				}
				acc[siteId] = siteDetailUIState;
				return acc;
		  }, {} as Record<string, SiteDetailUIModel>)
		: {};

	return [siteUIState, siteDetailUIStatesMap];
}

export default useSitesUIStates;
