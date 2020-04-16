import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { registerSitesAPI } from './lib/api';
import { registerContenDetailCompartment } from './lib/connectors/content';
import { routes } from './lib/services/routes/routes.class';
import { MODULE_PATHS } from './lib/sites.const';
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
	path: MODULE_PATHS.dashboard,
	component: Dashboard,
	isDefaultRoute: true,
	navigation: {
		label: 'Dashboard',
	},
});

Core.routes.register({
	path: MODULE_PATHS.root,
	exact: true,
	component: SitesComponent,
	navigation: {
		label: 'Sites',
	},
});

routes.register([
	{
		path: MODULE_PATHS.overview,
		component: SitesOverview,
	},
	{
		path: MODULE_PATHS.create,
		component: SitesCreate,
	},
	{
		path: MODULE_PATHS.detail,
		breadcrumb: null,
		component: SiteDetailComponent,
		routes: [
			{
				path: MODULE_PATHS.detailEdit,
				component: SitesUpdate,
			},
		],
	},
]);

// API export

registerSitesAPI();

export * from './lib/api/api.types';
