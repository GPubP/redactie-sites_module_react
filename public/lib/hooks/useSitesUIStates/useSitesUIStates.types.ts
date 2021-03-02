import { SiteDetailUIModel, SiteListUIModel } from '../../store/sites';

export type UseSitesUIStates = (
	siteId?: string
) => [SiteListUIModel, SiteDetailUIModel | undefined];
