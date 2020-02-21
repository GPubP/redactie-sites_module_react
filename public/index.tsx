import Core from '@redactie/redactie-core';
import React, { FC } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { siteRegistry } from './lib/services/siteRegistry/siteRegistry.class';

const SitesComponent: FC = () => {
	const match = useRouteMatch();
	const sites = siteRegistry.getAll();
	return (
		<div>
			<h1>Sites</h1>
			<nav>
				{sites.map(site => (
					<Link key={site.path} to={`${match.path}${site.path}`}>
						<p>{site.label}</p>
					</Link>
				))}
			</nav>
			<div>{siteRegistry.render(sites as any)}</div>
		</div>
	);
};

// expose route
Core.routes.register({
	path: '/sites',
	component: SitesComponent,
	label: 'Sites',
});

// expose module
Core.modules.exposeModuleApi('sites-module', {
	siteRegistry: siteRegistry,
});

export { SitesComponent };
