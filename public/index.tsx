import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { routes } from './lib/services/routes/routes.class';
import { Dashboard, SitesCreate, SitesOverview, SitesUpdate } from './lib/views';

const SitesComponent: FC<{ route: ModuleRouteConfig }> = ({ route }) => {
	const location = useLocation();

	// if path is /sites, redirect to /sites/beheer
	if (/\/sites$/.test(location.pathname)) {
		return <Redirect to={`${route.path}/beheer`} />;
	}

	return <>{Core.routes.render(route.routes as ModuleRouteConfig[], { basePath: route.path })}</>;
};

// expose route
Core.routes.register({
	path: '/dashboard',
	component: Dashboard,
	label: 'Dashboard',
	isDefaultRoute: true,
});

Core.routes.register({
	path: '/sites',
	exact: true,
	component: SitesComponent,
	label: 'Sites',
	routes: [
		{
			path: '/sites/beheer',
			component: SitesOverview,
		},
		{
			path: '/sites/aanmaken',
			component: SitesCreate,
		},
		{
			path: '/sites/:siteId/bewerken',
			component: SitesUpdate,
		},
	],
});

// expose module
Core.modules.exposeModuleApi('sites-module', {
	routes: routes,
});

export { SitesComponent };
