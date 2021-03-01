import { PaginationResponse } from '@datorama/akita';
import { SearchParams } from '@redactie/utils';

import { SiteResponse } from '../../services/sites';

export type UseSitesPagination = (
	sitesSearchParams: SearchParams,
	clearCache?: boolean
) => [PaginationResponse<SiteResponse> | null, () => void];
