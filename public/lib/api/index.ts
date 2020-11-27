import Core from '@redactie/redactie-core';

import { routes } from '../services/routes/routes.class';
import { SitesModuleAPI } from '../sites.types';

import { config } from './config';
import { hooks } from './hooks';
import { store } from './store';

export const registerSitesAPI = (): void => {
	const api: SitesModuleAPI = {
		routes,
		store,
		hooks,
		config,
	};
	Core.modules.exposeModuleApi('sites-module', api);
};
