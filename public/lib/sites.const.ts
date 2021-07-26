import { ALERT_CONTAINER_IDS, Tab, TabTypes } from './sites.types';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId', '/:tenantId/sites/:siteId/bewerken'],
};

export const OVERVIEW_QUERY_PARAMS_CONIG = {
	search: {
		type: 'string',
	},
	status: {
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
	detailExternal: '/:siteId/bewerken/:tab',
};

export const MODULE_API_NAME = 'sites-module';

export const DETAIL_TAB_MAP: {
	[key in 'settings']: Tab;
} = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		type: TabTypes.INTERNAL,
		active: true,
		disabled: false,
		containerId: ALERT_CONTAINER_IDS.update,
	},
};

export const DETAIL_TABS: Tab[] = [DETAIL_TAB_MAP.settings];
