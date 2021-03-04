import { SiteDetailModel, SiteDetailUIModel } from '../../store/sites';

export type UseSite = (
	siteId: string
) => [SiteDetailModel | undefined, SiteDetailUIModel | undefined];
