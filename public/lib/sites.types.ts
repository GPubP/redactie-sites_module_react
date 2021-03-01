import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { FilterItem } from '@redactie/utils';

import { UseSite } from './hooks/useSite';
import { UseSites } from './hooks/useSites/useSites.types';
import { UseSitesLoadingStates } from './hooks/useSitesLoadingStates';
import { UseSitesPagination } from './hooks/useSitesPagination';
import { Routes } from './services/routes';
import { SitesApiService } from './services/sites';
import { ALERT_CONTAINER_IDS } from './sites.const';
import { SitesFacade, SitesQuery } from './store/sites';
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
			query: SitesQuery;
		};
	};
	hooks: {
		useSite: UseSite;
		useSites: UseSites;
		useSitesPagination: UseSitesPagination;
		useSitesLoadingStates: UseSitesLoadingStates;
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
	description: string;
	userIsMember: boolean;
	navigateToEdit?: () => void;
}
