import { OrderBy, SearchParams } from './types';

export const BREADCRUMB_OPTIONS = {
	excludePaths: ['/', '/:tenantId'],
};

export const DEFAULT_SITES_SEARCH_PARAMS: SearchParams = {
	page: 1,
	pagesize: 20,
};

export const DEFAULT_SITES_SORTING: OrderBy = {
	key: 'name',
	order: 'asc',
};
