import { useSite, useSites, useSitesLoadingStates, useSitesPagination } from '../hooks';
import { SitesModuleAPI } from '../sites.types';

export const hooks: SitesModuleAPI['hooks'] = {
	useSite,
	useSites,
	useSitesPagination,
	useSitesLoadingStates,
};
