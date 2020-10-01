import { SearchParams } from '../api';

export interface SitesResponse {
	_embedded: SiteResponse[];
	_page: SitesMetaResponse;
}

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
	};
	userIsMember?: boolean;
}

export interface SitesMetaResponse {
	size: string;
	totalElements: number;
	totalPages: number;
	number: string;
}

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
