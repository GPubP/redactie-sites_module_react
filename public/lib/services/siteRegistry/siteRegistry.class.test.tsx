import { ModuleRouteConfig } from '@redactie/redactie-core';
import React from 'react';

import Sites from './siteRegistry.class';

describe('Sites', () => {
	let sites: Sites;

	const dummySiteConfig: ModuleRouteConfig = {
		path: '/external',
		label: 'external',
		component: () => React.createElement('div', { displayName: 'dummyComponent' }),
	};

	beforeEach(() => {
		sites = new Sites();
	});

	it('Should be able to register a route', () => {
		expect(sites).toBeInstanceOf(Sites);
		sites.register(dummySiteConfig);
		expect(sites.getAll()[0]).toEqual({ path: '/sites/external', ...dummySiteConfig });
	});
});
