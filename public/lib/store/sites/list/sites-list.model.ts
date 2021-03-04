import { CacheEntityState, Page } from '@redactie/utils';

import { SiteResponse } from '../../../services/sites';

export type SiteListModel = SiteResponse;
export type SiteListUIModel = {
	isCreating: boolean;
	isFetching: boolean;
	error?: any;
};

export interface SitesListState extends CacheEntityState<SiteListModel, string> {
	paging?: Page;
}
