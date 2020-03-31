import { OrderBy } from './services/api';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId'],
};

export const DEFAULT_SITES_SORTING: OrderBy = {
	key: 'name',
	order: 'asc',
};
