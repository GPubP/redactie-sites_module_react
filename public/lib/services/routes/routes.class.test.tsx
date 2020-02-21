import { ModuleRouteConfig } from '@redactie/redactie-core';
import React from 'react';

import Sites from './routes.class';

describe('Routes', () => {
	let sites: Sites;

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
		sites = new Sites();
	});

	it('Should be able to register a route', () => {
		expect(sites).toBeInstanceOf(Sites);
		sites.register(dummySiteConfig);
		expect(sites.getAll()[0]).toEqual({ path: '/sites/external', ...dummySiteConfig });
	});

	it('Should be able to register a childroute', () => {
		expect(sites).toBeInstanceOf(Sites);
		sites.register({ routes: [dummyChildRouteConfig], ...dummySiteConfig });
		expect(sites.getAll()[0].routes).toEqual([
			{
				path: '/sites/external/child',
				...dummyChildRouteConfig,
			},
		]);
	});
});
