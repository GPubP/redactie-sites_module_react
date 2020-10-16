import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

import { Routes } from './services/routes';
import { SitesFacade, SitesQuery } from './store/sites';

// Global types

export interface SitesRouteProps extends RouteConfigComponentProps {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface SitesDetailFormState {
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
			service: Partial<SitesFacade>;
			query: SitesQuery;
		};
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
