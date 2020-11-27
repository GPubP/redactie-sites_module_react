import { LoadingState } from '@redactie/utils';

import { SiteResponse } from '../../services/sites/sites.service.types';

export type UseSite = (siteId: string) => [LoadingState, SiteResponse | undefined];
