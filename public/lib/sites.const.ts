import { APIQueryParamsConfig } from '@redactie/utils';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId', '/:tenantId/sites/:siteId/bewerken'],
};

export const DEFAULT_SITES_SORTING: APIQueryParamsConfig = {
	sort: {
		defaultValue: 'data.name',
		type: 'string',
	},
	search: {
		defaultValue: '',
		type: 'string',
	},
};

export const TENANT_ROOT = '/:tenantId';

export const MODULE_PATHS = {
	dashboard: '/dashboard',
	root: '/sites',
	overview: '/beheer',
	create: '/aanmaken/instellingen',
	detail: '/:siteId',
	detailEdit: '/:siteId/bewerken/instellingen',
};

export const MODULE_API_NAME = 'sites-module';

export const SITES_INITIAL_FILTER_STATE = {
	name: '',
};

export const ALERT_CONTAINER_IDS = {
	create: 'create',
	update: 'update',
};
