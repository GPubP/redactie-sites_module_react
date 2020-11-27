import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { SiteModel, SitesState } from './sites.model';

@StoreConfig({ name: 'sites-sites', idKey: 'uuid' })
export class SitesStore extends BaseEntityStore<SitesState, SiteModel> {
	constructor(initialState: Partial<SitesState>) {
		super(initialState);
	}

	public setIsActivating(isActivating = false): void {
		this.update({
			isActivating,
		});
	}

	public setIsArchiving(isArchiving = false): void {
		this.update({
			isArchiving,
		});
	}
}

export const sitesStore = new SitesStore({
	detailIds: [],
	isActivating: false,
	isArchiving: false,
});
