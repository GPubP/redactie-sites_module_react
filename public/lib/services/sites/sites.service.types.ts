export interface SitesDetailRequestBody {
	name: string;
	description: string;
	contentTypes: string[];
}

export interface SiteSchema {
	uuid: string;
	data: {
		name: string;
		description: string;
		contentTypes: string[];
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
