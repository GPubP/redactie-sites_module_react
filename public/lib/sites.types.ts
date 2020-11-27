import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

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
			facade: Pick<SitesFacade, 'getSite' | 'getSitesPaginated' | 'updateSite' | 'getSites'>;
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

// Acpaas UI Component types

export interface Tab {
	name: string;
	target: string | null;
	active: boolean;
	disabled?: boolean;
}

export interface FilterItemSchema {
	key?: string;
	value: string;
	valuePrefix?: string;
	filterKey: string;
	formvalue?: any;
}
