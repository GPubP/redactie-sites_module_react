import { ModuleRouteConfig } from '@redactie/redactie-core';

export interface SitesRouteProps {
	basePath: string;
	routes: ModuleRouteConfig[];
}

export interface SitesDetailFormState {
	name: string;
}

export interface SitesDetailRequestBody {
	name: string;
	description: string;
}

export interface SiteSchema {
	uuid: string;
	data: {
		name: string;
		description: string;
	};
	meta: {
		tenant: string;
		createdAt: string;
		updatedAt: string;
		active: boolean;
	};
}

export interface SitesDataSchema {
	meta: SitesMetaSchema;
	data: SiteSchema[];
}

export interface SitesMetaSchema {
	size: string;
	totalElements: number;
	totalPages: number;
	number: string;
}

export interface SitesSchema {
	_embedded: SiteSchema[];
	_page: SitesMetaSchema;
}
