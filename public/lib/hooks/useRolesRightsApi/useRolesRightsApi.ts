import { RolesRightsModuleAPI } from '@redactie/roles-rights-module';

import { rolesRightsConnector } from '../../connectors/rolesRights';

const useRolesRightsApi = (): RolesRightsModuleAPI => {
	return rolesRightsConnector.getApi();
};

export default useRolesRightsApi;
