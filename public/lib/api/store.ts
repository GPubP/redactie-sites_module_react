import { sitesApiService } from '../services/sites';
import { sitesFacade } from '../store/sites';

import { SitesModuleStoreAPI } from './api.types';

export const store: SitesModuleStoreAPI = {
	sites: {
		service: sitesApiService,
		facade: {
			getSite: sitesFacade.getSite.bind(sitesFacade),
			getSitesPaginated: sitesFacade.getSitesPaginated.bind(sitesFacade),
			updateSite: sitesFacade.updateSite.bind(sitesFacade),
			selectSite: sitesFacade.selectSite.bind(sitesFacade),
			hasSite: sitesFacade.hasSite.bind(sitesFacade),
		},
	},
};
