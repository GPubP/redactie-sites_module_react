import { isNil } from 'ramda';
import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { LoadingState } from '../../sites.types';
import { SiteModel, SitesMetaModel, sitesQuery } from '../../store/sites';

const useSites = (): [LoadingState, SiteModel[], SitesMetaModel | null] => {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [sites, setSites] = useState<SiteModel[]>([]);
	const [sitesMeta, setSitesMeta] = useState<SitesMetaModel | null>(null);

	useEffect(() => {
		const destroyed$: Subject<boolean> = new Subject<boolean>();

		sitesQuery
			.selectAll()
			.pipe(
				takeUntil(destroyed$),
				filter(sites => !isNil(sites)),
				distinctUntilChanged()
			)
			.subscribe(sites => setSites(sites));

		sitesQuery.meta$
			.pipe(
				takeUntil(destroyed$),
				filter(meta => !isNil(meta)),
				distinctUntilChanged()
			)
			.subscribe(meta => {
				if (meta) {
					setSitesMeta(meta);
				}
			});

		sitesQuery.isFetching$.pipe(takeUntil(destroyed$)).subscribe(loading => {
			if (loading) {
				return setLoadingState(LoadingState.Loading);
			}

			setLoadingState(LoadingState.Loaded);
		});

		sitesQuery
			.selectError()
			.pipe(
				takeUntil(destroyed$),
				filter(error => !isNil(error)),
				distinctUntilChanged()
			)
			.subscribe(() => setLoadingState(LoadingState.Error));

		return () => {
			destroyed$.next(true);
			destroyed$.complete();
		};
	}, []);

	return [loadingState, sites, sitesMeta];
};

export default useSites;
