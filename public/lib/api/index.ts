import Core from '@redactie/redactie-core';

import * as API from './api';

export const registerSitesAPI = (): void => {
	Core.modules.exposeModuleApi('sites-module', API);
};

export { API };
