import { EntityStore, StoreConfig } from '@datorama/akita';

import { createInitialSitesState, SiteModel, SitesState } from './sites.model';

@StoreConfig({ name: 'sites', idKey: 'uuid' })
export class SitesStore extends EntityStore<SitesState, SiteModel> {
	constructor() {
		super(createInitialSitesState());
	}

	public setIsFetching(isFetching = false): void {
		this.update({
			isFetching,
		});
	}

	public setIsUpdating(isUpdating = false): void {
		this.update({
			isUpdating,
		});
	}

	public setIsCreating(isCreating = false): void {
		this.update({
			isCreating,
		});
	}

	public setIsActivating(isActivating = false): void {
		this.update({
			isActivating,
		});
	}
}

export const sitesStore = new SitesStore();
