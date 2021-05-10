import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { FilterItem } from '@redactie/utils';

import { useSitesUIStates } from './hooks';
import { UsePaginatedSites } from './hooks/usePaginatedSites';
import { UseSite } from './hooks/useSite';
import { Routes } from './services/routes';
import { SitesApiService } from './services/sites';
import { ALERT_CONTAINER_IDS } from './sites.const';
import { SitesFacade } from './store/sites';
// Global types

export interface SitesRouteProps extends RouteConfigComponentProps {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface SitesDetailFormState {
	uuid: string;
	name: string;
	url: string;
	contentTypes: string[];
}

export interface DefaultComponentProps {
	className?: string;
}

export interface SitesModuleAPI {
	routes: Routes;
	store: {
		sites: {
			service: SitesApiService;
			facade: Pick<SitesFacade, 'getSite' | 'getSitesPaginated' | 'updateSite'>;
		};
	};
	hooks: {
		useSite: UseSite;
		usePaginatedSites: UsePaginatedSites;
		useSitesUIStates: typeof useSitesUIStates;
	};
	config: {
		ALERT_CONTAINER_IDS: typeof ALERT_CONTAINER_IDS;
	};
}

export interface OverviewFilterItem extends FilterItem {
	filterKey: string;
	formvalue?: any;
}

export interface SitesOverviewRowData {
	id: string;
	name: string;
	active: boolean;
	url: string;
	userIsMember: boolean;
	navigateToEdit?: () => void;
}
