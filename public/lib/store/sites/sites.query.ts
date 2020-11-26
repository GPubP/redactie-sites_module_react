import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { SitesState } from './sites.model';
import { SitesStore, sitesStore } from './sites.store';

export class SitesQuery extends BaseEntityQuery<SitesState> {
	constructor(protected store: SitesStore) {
		super(store);
	}

	// Data
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public sites$ = this.selectAll();

	public hasDetailEntity = (entityId: string): boolean => {
		const state = this.store.getValue();

		if (!state.detailIds.includes(entityId)) {
			return false;
		}

		return this.hasEntity(entityId);
	};

	// State
	public isActivating$ = this.select(state => state.isActivating).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isArchiving$ = this.select(state => state.isArchiving).pipe(
		map(this.convertBoolToLoadingState)
	);
}

export const sitesQuery = new SitesQuery(sitesStore);
