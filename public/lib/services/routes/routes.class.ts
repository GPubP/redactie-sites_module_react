import Core, { ModuleRouteConfig } from '@redactie/redactie-core';

/**
 * Helper function to prefix all routes with /sites
 * @param routeConfig single route of type ModuleRouteConfig, may include subroutes
 */
const prefixRoute = (routeConfig: ModuleRouteConfig): ModuleRouteConfig => ({
	...routeConfig,
	path: `/sites${routeConfig.path}`,
	routes: routeConfig.routes?.map(prefixRoute),
	redirect: routeConfig.redirect && `/sites${routeConfig.redirect}`,
	navigation: routeConfig.navigation
		? {
				...routeConfig.navigation,
				parentPath: routeConfig.navigation.parentPath
					? `/sites${routeConfig.navigation.parentPath}`
					: undefined,
		  }
		: undefined,
});

class Routes {
	private registeredRoutes: ModuleRouteConfig[] = [];

	register(routeConfig: ModuleRouteConfig | ModuleRouteConfig[], last = false): void {
		const configs = Array.isArray(routeConfig) ? routeConfig : [routeConfig];
		const prefixedRoutes = configs.map(config => prefixRoute(config));

		this.registeredRoutes = last
			? [...this.registeredRoutes, ...prefixedRoutes]
			: [...prefixedRoutes, ...this.registeredRoutes];

		Core.routes.updateChildRoutes('/sites', this.registeredRoutes);
	}

	getAll(): ModuleRouteConfig[] {
		return this.registeredRoutes;
	}
}

export const routes = new Routes();

export default Routes;
