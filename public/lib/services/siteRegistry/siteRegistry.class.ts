import { ModuleRouteConfig } from '@redactie/redactie-core';

const prefixRoute = (routeConfig: ModuleRouteConfig): ModuleRouteConfig => {
	const updatedRouteConfig = routeConfig;
	updatedRouteConfig.path = `/sites${updatedRouteConfig.path}`;

	updatedRouteConfig.routes && updatedRouteConfig.routes.map(prefixRoute);
	return updatedRouteConfig;
};

class SiteRegistry {
	private registeredSites: ModuleRouteConfig[] = [];

	register(siteConfig: ModuleRouteConfig): void {
		const updatedSiteConfig = prefixRoute(siteConfig);
		this.registeredSites.push(updatedSiteConfig);
	}
	getAll(): ModuleRouteConfig[] {
		return this.registeredSites;
	}
}

export const siteRegistry = new SiteRegistry();

export default SiteRegistry;
