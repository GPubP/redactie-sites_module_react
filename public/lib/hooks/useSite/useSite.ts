import { useEffect, useState } from 'react';

import { SiteDetailModel, SiteDetailUIModel, sitesFacade } from '../../store/sites';

import { UseSite } from './useSite.types';

const useSite: UseSite = (siteId: string) => {
	const [site, setSite] = useState<SiteDetailModel>();
	const [siteUI, setSiteUI] = useState<SiteDetailUIModel>();

	useEffect(() => {
		if (!siteId) {
			return;
		}

		const hasSite = sitesFacade.hasSite(siteId);

		if (!hasSite) {
			sitesFacade.getSite({ id: siteId });
		}

		const siteSubscription = sitesFacade.selectSite(siteId).subscribe(setSite);
		const siteUISubscription = sitesFacade.selectSiteUIState(siteId).subscribe(setSiteUI);

		return () => {
			siteSubscription.unsubscribe();
			siteUISubscription.unsubscribe();
		};
	}, [siteId]);

	return [site, siteUI];
};

export default useSite;
