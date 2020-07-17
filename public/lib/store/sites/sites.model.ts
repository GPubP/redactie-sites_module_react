import { EntityState } from '@datorama/akita';

import { SiteResponse, SitesMetaResponse } from '../../services/sites';

export type SiteModel = SiteResponse;
export type SitesMetaModel = SitesMetaResponse;

export interface SitesState extends EntityState<SiteModel, string> {
	meta?: SitesMetaModel;
	site?: SiteModel;
	isFetching: boolean;
	isCreating: boolean;
	isUpdating: boolean;
	isActivating: boolean;
	isArchiving: boolean;
}

export const createInitialSitesState = (): SitesState => ({
	loading: false,
	isFetching: false,
	isCreating: false,
	isUpdating: false,
	isActivating: false,
	isArchiving: false,
});
