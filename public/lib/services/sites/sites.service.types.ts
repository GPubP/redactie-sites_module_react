import { EmbeddedResponse, Page, SearchParams } from '@redactie/utils';

export type SitesResponse = EmbeddedResponse<SiteResponse>;

export interface SiteResponse {
	uuid: string;
	data: {
		name: string;
		description: string;
		contentTypes: string[];
		url: string;
	};
	meta: {
		tenant: string;
		createdAt: string;
		updatedAt: string;
		active: boolean;
		contentItemsCount?: number;
	};
	userIsMember?: boolean;
}

export type SitesMetaResponse = Page;

export interface GetSitePayload {
	id: string;
}
export interface CreateSitePayload {
	name: string;
	description: string;
	contentTypes: string[];
}

export interface UpdateSitePayload {
	id: string;
	body: CreateSitePayload;
}

export type GetSitesPayload = SearchParams;

export interface UpdateSiteActivationPayload {
	id: string;
	activate: boolean;
}
