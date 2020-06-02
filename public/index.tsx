import Core from '@redactie/redactie-core';
import { RolesRightsModuleAPI } from '@redactie/roles-rights-module';
import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';

import { registerSitesAPI } from './lib/api';
import { rolesRightsConnector, RolesRightsConnector } from './lib/connectors/rolesRights';
import { TenantContext } from './lib/context';
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
		<TenantContext.Provider value={{ tenantId }}>
			{Core.routes.render(
				route.routes?.map(route => {
					return {
						...route,
						guardOptions: {
							...route.guardOptions,
							meta: {
								// Apparently a child route can not access the current tenantId by its route params
								// Most guards we use are using the tenant id to redirect to the 403 page
								// Therefore we need to send the current tenantId through the guards meta props
								tenantId,
							},
						},
					};
				}),
				{
					basePath: match.url,
					tenantId,
				}
			)}
		</TenantContext.Provider>
	);
};

const SiteDetailComponent: FC<SitesRouteProps> = ({ route, match, tenantId }) => {
	return (
		<>
			{Core.routes.render(
				route.routes?.map(route => {
					return {
						...route,
						guardOptions: {
							...route.guardOptions,
							meta: {
								// Apparently a child route can not access the current tenantId by its route params
								// Most guards we use are using the tenant id to redirect to the 403 page
								// Therefore we need to send the current tenantId through the guards meta props
								tenantId,
							},
						},
					};
				}),
				{
					basePath: match.url,
					tenantId,
				}
			)}
		</>
	);
};

const DashboardWrapperComponent: FC<SitesRouteProps> = props => {
	return (
		<TenantContext.Provider value={{ tenantId: props.tenantId }}>
			<Dashboard basePath={props.match.url} {...props}></Dashboard>
		</TenantContext.Provider>
	);
};

const initializeModule = (rolesRightsApi: RolesRightsModuleAPI): void => {
	// expose route
	Core.routes.register({
		path: MODULE_PATHS.dashboard,
		component: DashboardWrapperComponent,
		isDefaultRoute: true,
	});

	Core.routes.register({
		path: MODULE_PATHS.root,
		exact: true,
		component: SitesComponent,
		guardOptions: {
			guards: [
				rolesRightsApi.guards.securityRightsTenantGuard([
					RolesRightsConnector.securityRights.read,
				]),
			],
		},
		navigation: {
			label: 'Sites',
			canShown: [
				rolesRightsApi.canShowns.securityRightsTenantCanShown([
					RolesRightsConnector.securityRights.read,
				]),
			],
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
			guardOptions: {
				guards: [
					rolesRightsApi.guards.securityRightsTenantGuard([
						RolesRightsConnector.securityRights.create,
					]),
				],
			},
		},
		{
			path: MODULE_PATHS.detail,
			breadcrumb: null,
			component: SiteDetailComponent,
			guardOptions: {
				guards: [
					rolesRightsApi.guards.securityRightsTenantGuard([
						RolesRightsConnector.securityRights.update,
					]),
				],
			},
			routes: [
				{
					path: MODULE_PATHS.detailEdit,
					component: SitesUpdate,
				},
			],
		},
	]);
};

rolesRightsConnector.initialized$.subscribe(initializeModule);

// API export
registerSitesAPI();

export * from './lib/api/api.types';
