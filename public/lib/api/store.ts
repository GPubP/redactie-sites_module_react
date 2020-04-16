import { sitesQuery, sitesService } from '../store/sites';

export const store = {
	sites: {
		service: {
			getSite: sitesService.getSite,
			getSites: sitesService.getSites,
		},
		query: sitesQuery,
	},
};
