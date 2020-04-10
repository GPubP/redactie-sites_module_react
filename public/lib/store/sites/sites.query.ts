import { QueryEntity } from '@datorama/akita';

import { SitesState } from './sites.model';
import { SitesStore, sitesStore } from './sites.store';

export class SitesQuery extends QueryEntity<SitesState> {
	constructor(protected store: SitesStore) {
		super(store);
	}

	public meta$ = this.select(state => state.meta);
	public site$ = this.select(state => state.site);
	public isFetching$ = this.select(state => state.isFetching);
	public isCreating$ = this.select(state => state.isCreating);
	public isUpdating$ = this.select(state => state.isUpdating);
	public isActivating$ = this.select(state => state.isActivating);
}

export const sitesQuery = new SitesQuery(sitesStore);
