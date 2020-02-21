import React from 'react';

import Sites from './siteRegistry.class';
import { SiteConfig } from './siteRegistry.types';

describe('Sites', () => {
	let sites: Sites;

	const dummySiteConfig: SiteConfig = {
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
		expect(sites.getAll()).toEqual([dummySiteConfig]);
	});

	it('Should be able to render all sites', () => {
		expect(sites).toBeInstanceOf(Sites);
		sites.register(dummySiteConfig);
		const allSites = sites.getAll();
		expect(sites.render(allSites)).toBeInstanceOf(Object);
	});
});
