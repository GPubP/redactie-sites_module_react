import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { siteRegistry } from './lib/services/siteRegistry/siteRegistry.class';

const SitesComponent: FC<{ route: ModuleRouteConfig }> = ({ route }) => {
	const sites = siteRegistry.getAll();
	return (
		<div>
			<h1>Sites</h1>
			<nav>
				{sites.map(site => (
					<Link key={site.path} to={`${site.path}`}>
						<p>{site.label}</p>
					</Link>
				))}
			</nav>
			<div>{Core.routes.render(route.routes as ModuleRouteConfig[])}</div>
		</div>
	);
};

// expose route
Core.routes.register({
	path: '/sites',
	component: SitesComponent,
	label: 'Sites',
	routes: siteRegistry.getAll(),
});

// expose module
Core.modules.exposeModuleApi('sites-module', {
	siteRegistry: siteRegistry,
});

export { SitesComponent };
