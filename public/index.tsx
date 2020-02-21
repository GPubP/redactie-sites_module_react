import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { routes } from './lib/services/routes/routes.class';

const SitesComponent: FC<{ route: ModuleRouteConfig }> = ({ route }) => {
	const sites = routes.getAll();
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
	routes: routes.getAll(),
});

// expose module
Core.modules.exposeModuleApi('sites-module', {
	routes: routes,
});

export { SitesComponent };
