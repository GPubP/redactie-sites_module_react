/**
 * @module Module API
 */
import { routes } from '../services/routes/routes.class';

import { config } from './config';
import { hooks } from './hooks';
import { registerSiteUpdateTab } from './registerSiteUpdateTab';
import { store } from './store';

export { routes, store, hooks, config, registerSiteUpdateTab };
