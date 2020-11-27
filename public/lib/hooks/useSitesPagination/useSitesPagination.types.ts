import { PaginationResponse } from '@datorama/akita';

import { SearchParams } from '../../services/api';
import { SiteResponse } from '../../services/sites';

export type UseSitesPagination = (
	sitesSearchParams: SearchParams,
	clearCache?: boolean
) => [PaginationResponse<SiteResponse> | null, () => void];
