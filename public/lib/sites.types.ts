export interface SitesRouteProps {
	basePath: string;
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
