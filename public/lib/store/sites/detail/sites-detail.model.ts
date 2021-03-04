import { CacheEntityState, CacheEntityUI, CacheEntityUIState } from '@redactie/utils';

import { SiteResponse } from '../../../services/sites';

export type SiteDetailModel = SiteResponse;
export interface SiteDetailUIModel extends CacheEntityUI {
	isActivating: boolean;
	isArchiving: boolean;
}

export type SitesDetailState = CacheEntityState<SiteDetailModel, string>;
export type SitesDetailUIState = CacheEntityUIState<SiteDetailUIModel>;
