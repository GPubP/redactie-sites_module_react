import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { SitesOverview } from './views';

export const sitesRoutes = (route: any): any => {
	const SITES_PATHS = {
		root: route.path,
		beheer: `${route.path}/beheer`,
	};

	return [
		<Redirect key={SITES_PATHS.root} from={SITES_PATHS.root} to={SITES_PATHS.beheer} />,
		<Route key={SITES_PATHS.beheer} component={SitesOverview} path={SITES_PATHS.beheer} />,
	];
};
