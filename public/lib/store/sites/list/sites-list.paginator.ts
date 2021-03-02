import { PaginatorPlugin } from '@datorama/akita';

import { sitesListQuery } from './sites-list.query';

export const sitesListPaginator = new PaginatorPlugin(sitesListQuery).withControls().withRange();
