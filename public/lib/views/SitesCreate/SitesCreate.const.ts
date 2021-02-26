import { MODULE_PATHS, TENANT_ROOT } from '../../sites.const';
import { SitesDetailFormState } from '../../sites.types';

export const INITIAL_DETAIL_FORM_STATE = (): SitesDetailFormState => ({
	uuid: '',
	name: '',
	contentTypes: [],
	url: '',
});

export const SITES_CREATE_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.root}${MODULE_PATHS.detailEdit}`,
];
