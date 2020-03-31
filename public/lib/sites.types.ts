import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

// Global types

export interface SitesRouteProps extends RouteConfigComponentProps {
	basePath: string;
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface SitesDetailFormState {
	name: string;
}

export enum LoadingState {
	Loading = 'loading',
	Loaded = 'loaded',
	Error = 'error',
}

export interface DefaultComponentProps {
	className?: string;
}

// Acpaas UI Component types

export interface Tab {
	name: string;
	target: string;
	active: boolean;
	disabled?: boolean;
}
