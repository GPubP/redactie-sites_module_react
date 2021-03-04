import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import { SiteListModel, SitesListState } from './sites-list.model';

@StoreConfig({ name: 'sites-sites-list', idKey: 'uuid' })
export class SitesListStore extends CacheEntityStore<any, SitesListState, SiteListModel> {}

export const sitesListStore = new SitesListStore();
