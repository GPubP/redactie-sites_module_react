import Core from '@redactie/redactie-core';
import { RolesRightsModuleAPI } from '@redactie/roles-rights-module';
import { first } from 'rxjs/operators';

export class RolesRightsConnector {
	public static apiName = 'roles-rights-module';
	public static securityRights = {
		create: 'site-create-admin',
		update: 'site-update-admin',
		read: 'site-read-admin',
	};

	public initialized$ = Core.modules
		.selectModuleAPI<RolesRightsModuleAPI>(RolesRightsConnector.apiName)
		.pipe(first());

	public getApi(): RolesRightsModuleAPI {
		return Core.modules.getModuleAPI<RolesRightsModuleAPI>(RolesRightsConnector.apiName);
	}
}

export const rolesRightsConnector = new RolesRightsConnector();
