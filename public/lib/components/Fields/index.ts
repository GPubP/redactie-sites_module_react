import formRendererConnector from '../../connectors/formRenderer';

import { SitesSelect } from './SitesSelect';

export const registerFields = (): void =>
	formRendererConnector.api.fieldRegistry.add([
		{
			name: 'sitesSelect',
			module: 'sites',
			component: SitesSelect,
		},
	]);
