import { usePaginatedSites, useSite, useSitesUIStates } from '../hooks';
import { SitesModuleAPI } from '../sites.types';

export const hooks: SitesModuleAPI['hooks'] = {
	useSite,
	usePaginatedSites,
	useSitesUIStates,
};
