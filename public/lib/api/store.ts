import { sitesFacade, sitesQuery } from '../store/sites';

export const store = {
	sites: {
		service: {
			getSite: sitesFacade.getSite,
			getSites: sitesFacade.getSites,
		},
		query: sitesQuery,
	},
};
