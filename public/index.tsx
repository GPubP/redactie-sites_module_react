import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { routes } from './lib/services/routes/routes.class';
import { SitesCreate, SitesOverview } from './lib/views';

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
	path: '/sites',
	exact: true,
	component: SitesComponent,
	label: 'Sites',
	isDefaultRoute: true,
	routes: [
		{
			path: '/sites/beheer',
			// TODO: fix this in core package/routes.register types
			component: SitesOverview as any,
			routes: [],
		},
		{
			path: '/sites/aanmaken',
			// TODO: fix this in core package/routes.register types
			component: SitesCreate as any,
		},
	],
});

// expose module
Core.modules.exposeModuleApi('sites-module', {
	routes: routes,
});

export { SitesComponent };
