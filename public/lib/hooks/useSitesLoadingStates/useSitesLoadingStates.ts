import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { sitesQuery } from '../../store/sites';

import { SitesLoadingStates } from './useSitesLoadingStates.types';

const useSitesLoadingState = (): SitesLoadingStates => {
	const [isActivating, setIsActivating] = useState<boolean>(false);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [isCreating, setIsCreating] = useState<boolean>(false);
	const [isFetching, setIsFetching] = useState<boolean>(false);

	useEffect(() => {
		const destroyed$: Subject<boolean> = new Subject<boolean>();

		sitesQuery.isCreating$.pipe(takeUntil(destroyed$)).subscribe(loading => {
			if (loading) {
				return setIsCreating(true);
			}

			setIsCreating(false);
		});

		sitesQuery.isFetching$.pipe(takeUntil(destroyed$)).subscribe(loading => {
			if (loading) {
				return setIsFetching(true);
			}

			setIsFetching(false);
		});

		sitesQuery.isActivating$.pipe(takeUntil(destroyed$)).subscribe(loading => {
			if (loading) {
				return setIsActivating(true);
			}

			setIsActivating(false);
		});

		sitesQuery.isUpdating$.pipe(takeUntil(destroyed$)).subscribe(loading => {
			if (loading) {
				return setIsUpdating(true);
			}

			setIsUpdating(false);
		});

		return () => {
			destroyed$.next(true);
			destroyed$.complete();
		};
	}, []);

	return {
		isCreating,
		isFetching,
		isUpdating,
		isActivating,
	};
};

export default useSitesLoadingState;
