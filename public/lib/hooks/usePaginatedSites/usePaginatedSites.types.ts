import { PaginationResponse } from '@datorama/akita';
import { SearchParams } from '@redactie/utils';

import { SiteListModel } from '../../store/sites';

export type UsePaginatedSites = (
	sitesSearchParams: SearchParams,
	clearCache?: boolean
) => {
	loading: boolean;
	pagination: PaginationResponse<SiteListModel> | null;
	refreshCurrentPage: () => void;
	error: any | null;
};
