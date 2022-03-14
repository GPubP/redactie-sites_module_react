import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { ContextHeaderTab, FilterItem } from '@redactie/utils';

import { registerSiteUpdateTab } from './api/registerSiteUpdateTab';
import { useSitesUIStates } from './hooks';
import { UsePaginatedSites } from './hooks/usePaginatedSites';
import { UseSite } from './hooks/useSite';
import { Routes } from './services/routes';
import { ModuleSettings, SitesApiService } from './services/sites';
import { SiteDetailModel, SiteDetailUIModel, SitesFacade } from './store/sites';
import { ExternalTabValue } from './views/SitesUpdateExternal';
// Global types

export enum ALERT_CONTAINER_IDS {
	create = 'sites-create',
	update = 'sites-update',
	fetch = 'sites-fetch',
	fetchOne = 'sites-fetch-one',
}

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
	languages: string[];
}

export interface SitesDetailData {
	name: string;
	url: string;
	contentTypes: string[];
	languages: string[];
	description: string;
	modulesConfig: ModuleSettings[];
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
	registerSiteUpdateTab: typeof registerSiteUpdateTab;
}

export interface OverviewFilterItem extends FilterItem {
	filterKey: string;
	formvalue?: any;
}

export interface Tab extends ContextHeaderTab {
	id?: string;
	type: TabTypes;
	containerId: ALERT_CONTAINER_IDS;
}

export enum TabTypes {
	'INTERNAL',
	'EXTERNAL',
}

export interface SitesOverviewRowData {
	id: string;
	name: string;
	active: boolean;
	url: string;
	userIsMember: boolean;
	navigateToEdit?: () => void;
}

export interface SitesUpdateRouteParams {
	siteUuid: string;
}

export interface SitesUpdateRouteProps<Params = SitesUpdateRouteParams>
	extends RouteConfigComponentProps<Params> {
	readonly allowedPaths?: string[];
	readonly site: SiteDetailModel;
	readonly siteUI: SiteDetailUIModel;
	onCancel: () => void;
	onSubmit: (data: SitesDetailFormState | ExternalTabValue, tab: Tab, cb?: () => void) => void;
	readonly isChanged: boolean;
}
