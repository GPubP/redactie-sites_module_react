import { BaseEntityState } from '@redactie/utils';

import { SiteResponse, SitesMetaResponse } from '../../services/sites';

export type SiteModel = SiteResponse;
export type SitesMetaModel = SitesMetaResponse;

export interface SitesState extends BaseEntityState<SiteModel, string> {
	meta?: SitesMetaModel;
	detailIds: string[];
	isActivating: boolean;
	isArchiving: boolean;
}
