import { ContextHeaderTab } from '@redactie/utils';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId', '/:tenantId/sites/:siteId/bewerken'],
};

export const OVERVIEW_QUERY_PARAMS_CONIG = {
	search: {
		defaultValue: '',
		type: 'string',
	},
	status: {
		defaultValue: '',
		type: 'string',
	},
	sparse: {
		defaultValue: true,
		type: 'boolean',
	},
} as const;

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

export const DETAIL_TABS: ContextHeaderTab[] = [{ name: 'Instellingen', target: '', active: true }];

export const ALERT_CONTAINER_IDS = {
	create: 'sites-create',
	update: 'sites-update',
	fetch: 'sites-fetch',
	fetchOne: 'sites-fetch-one',
};
