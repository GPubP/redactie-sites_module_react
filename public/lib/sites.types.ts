import { LanguageModel } from '@redactie/language-module';
import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { ContextHeaderTab, FilterItem } from '@redactie/utils';

import { ALERT_CONTAINER_IDS } from './api/api.types';
import { ModuleSettings } from './services/sites';
import { SiteDetailModel, SiteDetailUIModel } from './store/sites';
import { ExternalTabValue } from './views/SitesUpdateExternal';

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
	url: string | Record<string, string>;
	languages: LanguageModel[];
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

export * from './api/api.types';
