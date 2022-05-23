import {
	SiteDetailModel,
	SiteListModel,
	SitesDetailState,
	SitesListState,
} from '../../lib/store/sites';
import { registerSiteUpdateTab } from '../api/registerSiteUpdateTab';
import { useSitesUIStates } from '../hooks';
import { UsePaginatedSites } from '../hooks/usePaginatedSites';
import { UseSite } from '../hooks/useSite';
import { Routes } from '../services/routes';
import { SitesApiService } from '../services/sites';
import { ExternalTabOptions } from '../store/api/externalTabs';
import { SitesFacade } from '../store/sites/sites.facade';
import { ExternalTabProps } from '../views/SitesUpdateExternal';

export enum ALERT_CONTAINER_IDS {
	create = 'sites-create',
	update = 'sites-update',
	fetch = 'sites-fetch',
	fetchOne = 'sites-fetch-one',
}

export interface SitesModuleStoreAPI {
	sites: {
		service: SitesApiService;
		facade: Pick<
			SitesFacade,
			'getSite' | 'getSitesPaginated' | 'updateSite' | 'selectSite' | 'hasSite'
		>;
	};
}

export interface SitesModuleHooksAPI {
	useSite: UseSite;
	usePaginatedSites: UsePaginatedSites;
	useSitesUIStates: typeof useSitesUIStates;
}

export interface SitesModuleConfigAPI {
	ALERT_CONTAINER_IDS: typeof ALERT_CONTAINER_IDS;
}

export interface SitesModuleAPI {
	routes: Routes;
	store: SitesModuleStoreAPI;
	hooks: SitesModuleHooksAPI;
	config: SitesModuleConfigAPI;
	registerSiteUpdateTab: typeof registerSiteUpdateTab;
}

export {
	SiteDetailModel,
	SiteListModel,
	SitesListState,
	SitesDetailState,
	// External tab types
	ExternalTabOptions,
	ExternalTabProps,
};

export * from '../services/sites/sites.service.types';
