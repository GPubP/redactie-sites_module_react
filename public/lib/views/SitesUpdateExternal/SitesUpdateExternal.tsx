import React, { FC, useEffect, useMemo } from 'react';

import { mapExternalTabToTab } from '../../helpers';
import { SitesUpdateRouteProps, Tab } from '../../sites.types';
import { useExternalTabsFacade } from '../../store/api/externalTabs/externalTabs.facade';

import { ExternalTabValue, SiteUpdateMatchProps } from './SitesUpdateExternal.types';

const SitesUpdateExternal: FC<SitesUpdateRouteProps<SiteUpdateMatchProps>> = ({
	site,
	siteUI,
	onCancel,
	onSubmit,
	match,
}) => {
	const { tab } = match.params;

	/**
	 * HOOKS
	 */
	const [{ active: activeTab }, activate] = useExternalTabsFacade();
	const isLoading = useMemo(() => {
		return siteUI.isFetching || siteUI.isUpdating;
	}, [siteUI]);

	useEffect(() => {
		activate(tab);
	}, [tab]); // eslint-disable-line

	/**
	 * METHODS
	 */

	const onExternalTabSubmit = (value: ExternalTabValue): void => {
		if (!activeTab) {
			return;
		}

		onSubmit(value, mapExternalTabToTab(activeTab));
	};

	const getExternalTabValue = (activeTab: Tab): ExternalTabValue => {
		if (!site) {
			return { config: {}, validationSchema: {} };
		}

		const moduleSettings = (site.data.modulesConfig || []).find(
			moduleConfig => moduleConfig.name === activeTab.id
		);

		return {
			config: moduleSettings?.config || {},
			validationSchema: moduleSettings?.validationSchema || {},
		};
	};

	/**
	 * RENDER
	 */
	return activeTab ? (
		<activeTab.component
			site={site}
			onSubmit={(values: ExternalTabValue) => onExternalTabSubmit(values)}
			onCancel={() => onCancel()}
			updateSite={() => null}
			value={getExternalTabValue(mapExternalTabToTab(activeTab))}
			isLoading={isLoading}
		/>
	) : null;
};

export default SitesUpdateExternal;
