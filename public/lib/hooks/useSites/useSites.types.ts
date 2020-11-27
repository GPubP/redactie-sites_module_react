import { LoadingState } from '@redactie/utils';

import { SiteModel } from '../../store/sites';

export type UseSites = () => [LoadingState, SiteModel[]];
