import { ModuleRouteConfig } from '@redactie/redactie-core';

export default interface Routes {
	register: (routeConfig: ModuleRouteConfig) => void;
	getAll: () => ModuleRouteConfig[];
}
