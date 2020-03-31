import { ModuleRouteConfig } from '@redactie/redactie-core';

export interface RoutesAPI {
	register: (routeConfig: ModuleRouteConfig) => void;
	getAll: () => ModuleRouteConfig[];
}
