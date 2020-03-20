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

	return <>{Core.routes.render(route.routes as ModuleRouteConfig[])}</>;
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
			component: SitesOverview,
			routes: [
				{
					path: '/sites/beheer/aanmaken',
					component: SitesCreate,
				},
			],
		},
	],
});

// expose module
Core.modules.exposeModuleApi('sites-module', {
	routes: routes,
});

export { SitesComponent };
