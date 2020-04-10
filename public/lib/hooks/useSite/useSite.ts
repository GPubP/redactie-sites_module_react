import { isNil } from 'ramda';
import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { LoadingState } from '../../sites.types';
import { SiteModel, sitesQuery } from '../../store/sites';

const useSite = (): [LoadingState, SiteModel | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [site, setSite] = useState<SiteModel | null>(null);

	useEffect(() => {
		const destroyed$: Subject<boolean> = new Subject<boolean>();

		sitesQuery.site$
			.pipe(
				takeUntil(destroyed$),
				filter(site => !isNil(site)),
				distinctUntilChanged()
			)
			.subscribe(site => {
				if (site) {
					setSite(site);
				}
			});

		sitesQuery
			.selectError()
			.pipe(
				takeUntil(destroyed$),
				filter(error => !isNil(error)),
				distinctUntilChanged()
			)
			.subscribe(() => setLoadingState(LoadingState.Error));

		sitesQuery.isFetching$.pipe(takeUntil(destroyed$)).subscribe(loading => {
			if (loading) {
				return setLoadingState(LoadingState.Loading);
			}

			setLoadingState(LoadingState.Loaded);
		});

		return () => {
			destroyed$.next(true);
			destroyed$.complete();
		};
	}, []);

	return [loadingState, site];
};

export default useSite;
