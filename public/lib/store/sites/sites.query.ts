import { isNil, QueryEntity } from '@datorama/akita';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { LoadingState } from '../../sites.types';

import { SitesState } from './sites.model';
import { SitesStore, sitesStore } from './sites.store';

export class SitesQuery extends QueryEntity<SitesState> {
	constructor(protected store: SitesStore) {
		super(store);
	}

	private convertBoolToLoadingState(bool: boolean): LoadingState {
		if (bool) {
			return LoadingState.Loading;
		}

		return LoadingState.Loading;
	}

	// Data
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public sites$ = this.selectAll().pipe(filter(sites => !isNil(sites), distinctUntilChanged()));
	public site$ = this.select(state => state.site).pipe(
		filter(site => !isNil(site), distinctUntilChanged())
	);

	// State
	public error$ = this.selectError().pipe(filter(error => !isNil(error), distinctUntilChanged()));
	public isFetching$ = this.select(state => state.isFetching).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isCreating$ = this.select(state => state.isCreating).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isUpdating$ = this.select(state => state.isUpdating).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isActivating$ = this.select(state => state.isActivating).pipe(
		map(this.convertBoolToLoadingState)
	);
}

export const sitesQuery = new SitesQuery(sitesStore);
