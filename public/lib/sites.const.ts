import { APIQueryParamsConfig } from '@redactie/utils';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId'],
};

export const DEFAULT_SITES_SORTING: APIQueryParamsConfig = {
	sort: {
		defaultValue: 'data.name',
		type: 'string',
	},
};

export const MODULE_PATHS = {
	dashboard: '/dashboard',
	root: '/sites',
	overview: '/beheer',
	create: '/aanmaken',
	detail: '/:siteId',
	detailEdit: '/:siteId/bewerken',
};

export const MODULE_API_NAME = 'sites-module';
