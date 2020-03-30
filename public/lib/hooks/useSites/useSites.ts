import { useEffect, useState } from 'react';

import { getSites } from '../../sites.service';
import { SitesDataSchema } from '../../sites.types';
import { LoadingState, SearchParams } from '../../types';

const useSites = (searchParams: SearchParams): [LoadingState, SitesDataSchema | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [sites, setSites] = useState<SitesDataSchema | null>(null);

	useEffect(() => {
		setLoadingState(LoadingState.Loading);
		getSites(searchParams)
			.then(result => {
				if (result?.data.length) {
					setSites(result);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, [searchParams]);

	return [loadingState, sites];
};

export default useSites;
