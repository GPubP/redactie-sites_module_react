import { CacheEntityQuery } from '@redactie/utils';

import { SitesDetailState, SitesDetailUIState } from './sites-detail.model';
import { sitesDetailStore, SitesDetailStore } from './sites-detail.store';

export class SitesDetailQuery extends CacheEntityQuery<SitesDetailUIState, SitesDetailState> {
	constructor(protected store: SitesDetailStore) {
		super(store);
	}
}

export const sitesDetailQuery = new SitesDetailQuery(sitesDetailStore);
