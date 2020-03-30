import { SitesDetailFormState } from './sites.types';
import { OrderBy } from './types';

export const generateDetailFormState = (): SitesDetailFormState => ({
	name: '',
});

export const parseOrderBy = (orderBy: OrderBy): string => {
	return orderBy.order === 'asc' ? orderBy.key : `-${orderBy.key}`;
};
