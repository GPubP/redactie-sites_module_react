import { sitesApiService } from '../services/sites';
import { SitesModuleAPI } from '../sites.types';
import { sitesFacade } from '../store/sites';

export const store: SitesModuleAPI['store'] = {
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
