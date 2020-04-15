import { OrderBy } from './services/api';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId'],
};

export const DEFAULT_SITES_SORTING: OrderBy = {
	key: 'name',
	order: 'asc',
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
