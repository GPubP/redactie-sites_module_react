import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { routes } from './lib/services/routes/routes.class';
import { MODULE_API_NAME, MODULE_PATHS } from './lib/sites.const';
import { SitesModuleAPI, SitesRouteProps } from './lib/sites.types';
import { SiteModel, SitesMetaModel, sitesQuery, sitesService, SitesState } from './lib/store/sites';
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

const api: SitesModuleAPI = {
	routes,
	store: {
		sites: {
			service: {
				getSite: sitesService.getSite,
				getSites: sitesService.getSites,
			},
			query: sitesQuery,
		},
	},
};

Core.modules.exposeModuleApi(MODULE_API_NAME, api);

export { SitesModuleAPI, SiteModel, SitesMetaModel, SitesState };
