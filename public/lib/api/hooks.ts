import { usePaginatedSites, useSite, useSitesUIStates } from '../hooks';

import { SitesModuleHooksAPI } from './api.types';

export const hooks: SitesModuleHooksAPI = {
	useSite,
	usePaginatedSites,
	useSitesUIStates,
};
