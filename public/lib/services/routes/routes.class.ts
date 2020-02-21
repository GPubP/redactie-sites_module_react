import { ModuleRouteConfig } from '@redactie/redactie-core';

/**
 * Helper function to prefix all routes with /sites
 * @param routeConfig single route of type ModuleRouteConfig, may include subroutes
 */
const prefixRoute = (routeConfig: ModuleRouteConfig): ModuleRouteConfig => {
	const updatedRouteConfig = routeConfig;
	updatedRouteConfig.path = `/sites${updatedRouteConfig.path}`;

	updatedRouteConfig.routes && updatedRouteConfig.routes.map(prefixRoute);
	return updatedRouteConfig;
};

class Routes {
	private registeredSites: ModuleRouteConfig[] = [];

	register(siteConfig: ModuleRouteConfig): void {
		const updatedSiteConfig = prefixRoute(siteConfig);
		this.registeredSites.push(updatedSiteConfig);
	}
	getAll(): ModuleRouteConfig[] {
		return this.registeredSites;
	}
}

export const routes = new Routes();

export default Routes;
