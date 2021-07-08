import { ExternalTabOptions, externalTabsService } from '../store/api/externalTabs';

export const registerSiteUpdateTab = (name: string, options: ExternalTabOptions): void =>
	externalTabsService.registerTabs(name, options);
