import Core from '@redactie/redactie-core';

import { routes } from '../services/routes/routes.class';

import { store } from './store';

export const registerSitesAPI = (): void =>
	Core.modules.exposeModuleApi('sites-module', {
		routes,
		store,
	});
