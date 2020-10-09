import Core from '@redactie/redactie-core';
import { RolesRightsModuleAPI } from '@redactie/roles-rights-module';
import { RenderChildRoutes, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { registerSitesAPI } from './lib/api';
import { rolesRightsConnector, RolesRightsConnector } from './lib/connectors/rolesRights';
import { routes } from './lib/services/routes/routes.class';
import { MODULE_PATHS } from './lib/sites.const';
import { SitesRouteProps } from './lib/sites.types';
import { Dashboard, SitesCreate, SitesOverview, SitesUpdate } from './lib/views';

const SitesComponent: FC<SitesRouteProps> = ({ route, match, tenantId }) => {
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);
	const extraOptions = useMemo(
		() => ({
			basePath: match.url,
			tenantId,
		}),
		[match.url, tenantId]
	);
	return (
		<TenantContext.Provider value={{ tenantId }}>
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		</TenantContext.Provider>
	);
};

const SiteDetailComponent: FC<SitesRouteProps> = ({ route, match, tenantId }) => {
	const guardsMeta = useMemo(
		() => ({
			tenantId,
		}),
		[tenantId]
	);
	const extraOptions = useMemo(
		() => ({
			basePath: match.url,
			tenantId,
		}),
		[match.url, tenantId]
	);

	return (
		<RenderChildRoutes
			routes={route.routes}
			guardsMeta={guardsMeta}
			extraOptions={extraOptions}
		/>
	);
};

const DashboardWrapperComponent: FC<SitesRouteProps> = props => {
	return (
		<TenantContext.Provider value={{ tenantId: props.tenantId }}>
			<Dashboard {...props}></Dashboard>
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
		redirect: `${MODULE_PATHS.root}${MODULE_PATHS.overview}`,
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

	routes.register(
		[
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
				routes: [
					{
						path: MODULE_PATHS.detailEdit,
						component: SitesUpdate,
						guardOptions: {
							guards: [
								rolesRightsApi.guards.securityRightsTenantGuard([
									RolesRightsConnector.securityRights.update,
								]),
							],
						},
					},
				],
			},
		],
		true
	);
};

rolesRightsConnector.initialized$.subscribe(initializeModule);

// API export
registerSitesAPI();

export * from './lib/api/api.types';
