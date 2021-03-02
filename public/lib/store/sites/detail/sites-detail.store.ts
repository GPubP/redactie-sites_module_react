import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import { SiteDetailModel, SitesDetailState, SitesDetailUIState } from './sites-detail.model';

@StoreConfig({ name: 'sites-sites-detail', idKey: 'uuid' })
export class SitesDetailStore extends CacheEntityStore<
	SitesDetailUIState,
	SitesDetailState,
	SiteDetailModel
> {}

export const sitesDetailStore = new SitesDetailStore();
