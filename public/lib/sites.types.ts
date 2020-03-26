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
	};
}
