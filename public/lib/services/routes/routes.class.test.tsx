import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import React from 'react';

import Routes from './routes.class';

describe('Routes', () => {
	let routes: Routes;

	const dummySiteConfig: ModuleRouteConfig = {
		path: '/external',
		label: 'external',
		component: () => React.createElement('div', { displayName: 'dummyComponent' }),
	};

	const dummyChildRouteConfig: ModuleRouteConfig = {
		path: '/external/child',
		label: 'external child',
		component: () => React.createElement('div', { displayName: 'dummyComponentChild' }),
	};

	beforeEach(() => {
		routes = new Routes();
	});

	it('Should be able to register a route', () => {
		const updateChildRoutesSpy = spyOn(Core.routes, 'updateChildRoutes');

		expect(routes).toBeInstanceOf(Routes);
		routes.register(dummySiteConfig);
		expect(routes.getAll()[0]).toEqual({
			...dummySiteConfig,
			path: '/sites/external',
		});
		expect(updateChildRoutesSpy).toHaveBeenCalledWith('/sites', routes.getAll());
	});

	it('Should be able to register a childroute', () => {
		expect(routes).toBeInstanceOf(Routes);
		routes.register({
			...dummySiteConfig,
			routes: [dummyChildRouteConfig],
		});
		expect(routes.getAll()[0].routes).toEqual([
			{
				...dummyChildRouteConfig,
				path: '/sites/external/child',
			},
		]);
	});
});
