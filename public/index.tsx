import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { routes } from './lib/services/routes/routes.class';
import { SitesRouteProps } from './lib/sites.types';
import { Dashboard, SitesCreate, SitesOverview, SitesUpdate } from './lib/views';

const SitesComponent: FC<SitesRouteProps> = ({ route, match, location, tenantId }) => {
	// if path is /sites, redirect to /sites/beheer
	if (/\/sites$/.test(location.pathname)) {
		return <Redirect to={`${route.path}/beheer`} />;
	}

	return (
		<>
			{Core.routes.render(route.routes as ModuleRouteConfig[], {
				basePath: match.url,
				tenantId,
			})}
		</>
	);
};

const SiteDetailComponent: FC<SitesRouteProps> = ({ route, match, tenantId }) => {
	return (
		<>
			{Core.routes.render(route.routes as ModuleRouteConfig[], {
				basePath: match.url,
				tenantId,
			})}
		</>
	);
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
});

routes.register([
	{
		path: '/beheer',
		component: SitesOverview,
	},
	{
		path: '/aanmaken',
		component: SitesCreate,
	},
	{
		path: '/:siteId',
		breadcrumb: null,
		component: SiteDetailComponent,
		routes: [
			{
				path: '/:siteId/bewerken',
				component: SitesUpdate,
			},
		],
	},
]);

// expose module
Core.modules.exposeModuleApi('sites-module', {
	routes: routes,
});

export { SitesComponent };
