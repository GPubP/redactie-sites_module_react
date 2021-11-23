// import { akitaDevtools } from '@datorama/akita';
import Core from '@redactie/redactie-core';
import { RolesRightsModuleAPI } from '@redactie/roles-rights-module';
import { RenderChildRoutes, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { registerSitesAPI } from './lib/api';
import { SitesPreNavigation } from './lib/components';
import { registerFields } from './lib/components/Fields';
import { rolesRightsConnector, RolesRightsConnector } from './lib/connectors/rolesRights';
import { routes } from './lib/services/routes/routes.class';
import { MODULE_PATHS, TENANT_ROOT } from './lib/sites.const';
import { SitesRouteProps } from './lib/sites.types';
import { Dashboard, SitesCreate, SitesOverview, SitesUpdate } from './lib/views';
import SitesDetail from './lib/views/SitesDetail/SitesDetail';
import { SitesUpdateExternal } from './lib/views/SitesUpdateExternal';
console.log('sites');

// akitaDevtools();

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

const DashboardWrapperComponent: FC<SitesRouteProps> = props => {
	return (
		<TenantContext.Provider value={{ tenantId: props.tenantId }}>
			<Dashboard {...props} />
		</TenantContext.Provider>
	);
};

const initializeModule = (rolesRightsApi: RolesRightsModuleAPI): void => {
	// Expose route
	Core.routes.register({
		path: MODULE_PATHS.dashboard,
		breadcrumb: false,
		component: DashboardWrapperComponent,
		isDefaultRoute: true,
	});

	Core.routes.register({
		path: MODULE_PATHS.root,
		exact: true,
		component: SitesComponent,
		redirect: `${MODULE_PATHS.root}${MODULE_PATHS.overview}`,
		navigation: {
			order: 0,
			label: 'Sites',
			canShown: [
				rolesRightsApi.canShowns.securityRightsTenantCanShown([
					RolesRightsConnector.securityRights.read,
				]),
			],
		},
	});

	Core.preNavigation.register({
		component: SitesPreNavigation,
		includePaths: [`${TENANT_ROOT}${MODULE_PATHS.root}${MODULE_PATHS.detail}`],
		excludePaths: [
			`${TENANT_ROOT}${MODULE_PATHS.root}${MODULE_PATHS.detailEdit}`,
			`${TENANT_ROOT}${MODULE_PATHS.root}${MODULE_PATHS.detailExternal}`,
			`${TENANT_ROOT}${MODULE_PATHS.root}${MODULE_PATHS.overview}`,
			`${TENANT_ROOT}${MODULE_PATHS.root}${MODULE_PATHS.create}`,
		],
	});

	routes.register(
		[
			{
				path: MODULE_PATHS.overview,
				breadcrumb: false,
				component: SitesOverview,
				guardOptions: {
					guards: [
						rolesRightsApi.guards.securityRightsTenantGuard([
							RolesRightsConnector.securityRights.read,
						]),
					],
				},
			},
			{
				path: MODULE_PATHS.create,
				breadcrumb: false,
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
				breadcrumb: false,
				component: SitesDetail,
				guardOptions: {
					guards: [
						rolesRightsApi.guards.securityRightsTenantGuard([
							RolesRightsConnector.securityRights.read,
						]),
					],
				},
				routes: [
					{
						path: MODULE_PATHS.detailEdit,
						component: SitesUpdate,
						breadcrumb: false,
						guardOptions: {
							guards: [
								rolesRightsApi.guards.securityRightsTenantGuard([
									RolesRightsConnector.securityRights.update,
								]),
							],
						},
					},
					{
						path: MODULE_PATHS.detailExternal,
						breadcrumb: false,
						component: SitesUpdateExternal,
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
registerFields();

export * from './lib/api/api.types';
