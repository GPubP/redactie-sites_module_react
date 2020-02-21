import React from 'react';
import { Route, RouteComponentProps, Switch, SwitchProps } from 'react-router-dom';

import { SiteConfig } from './siteRegistry.types';

class SiteRegistry {
	private registeredSites: SiteConfig[] = [];

	register(siteConfig: SiteConfig): void {
		this.registeredSites.push(siteConfig);
	}
	getAll(): SiteConfig[] {
		return this.registeredSites;
	}
	render(
		routes: SiteConfig[] | undefined,
		extraProps: any = {},
		switchProps: SwitchProps = {}
	): any {
		return routes ? (
			<Switch {...switchProps}>
				{routes.map((route, index) => {
					return (
						<Route
							key={route.path || index}
							path={`/sites${route.path}`}
							render={(props: RouteComponentProps): JSX.Element =>
								route.render ? (
									route.render({ ...props, ...extraProps, route: route })
								) : (
									<route.component {...props} {...extraProps} route={route} />
								)
							}
						/>
					);
				})}
			</Switch>
		) : null;
	}
}

export const siteRegistry = new SiteRegistry();

export default SiteRegistry;
