import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';

import { routes } from './lib/services/routes/routes.class';
import { sitesRoutes } from './lib/sites.routes';

const SitesComponent: FC<{ route: ModuleRouteConfig }> = ({ route }) => {
	return <>{...sitesRoutes(route)}</>;
};

// expose route
Core.routes.register({
	path: '/sites',
	component: SitesComponent,
	label: 'Sites',
});

// expose module
Core.modules.exposeModuleApi('sites-module', {
	routes: routes,
});

export { SitesComponent };
