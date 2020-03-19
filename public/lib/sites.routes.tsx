import React from 'react';
import { Route } from 'react-router-dom';

import { SitesOverview } from './views';

export const SITES_PATHS = {
	root: '/',
};

export const sitesRoutes = [
	<Route key={SITES_PATHS.root} component={SitesOverview} path={SITES_PATHS.root} />,
];
