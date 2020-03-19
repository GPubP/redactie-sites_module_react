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

export interface SitesSchema {
	_embedded: SitesSchema[];
}
