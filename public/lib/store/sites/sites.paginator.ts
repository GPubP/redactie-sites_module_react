import { PaginatorPlugin } from '@datorama/akita';

import { sitesQuery } from './sites.query';

export const sitesPaginator = new PaginatorPlugin(sitesQuery).withControls().withRange();
