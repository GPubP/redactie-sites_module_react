import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	ContextHeaderTabLinkProps,
	DataLoader,
	RenderChildRoutes,
	useNavigate,
	useOnNextRender,
	useRoutes,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, ReactElement, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useHomeBreadcrumb, useSite } from '../../hooks';
import useActiveTabs from '../../hooks/useActiveTabs/useActiveTabs';
import { ModuleSettings } from '../../services/sites';
import { BREADCRUMB_OPTIONS, DETAIL_TABS, MODULE_PATHS } from '../../sites.const';
import {
	ALERT_CONTAINER_IDS,
	SitesDetailData,
	SitesDetailFormState,
	SitesRouteProps,
	Tab,
	TabTypes,
} from '../../sites.types';
import { useExternalTabsFacade } from '../../store/api/externalTabs';
import { SiteDetailModel, sitesFacade } from '../../store/sites';
import { ExternalTabValue } from '../SitesUpdateExternal';

import { BADGES } from './SitesDetail.const';

const SitesDetail: FC<SitesRouteProps> = ({ location, route }) => {
	const { siteId } = useParams<{ siteId: string }>();

	/**
	 * Hooks
	 */
	const [site, siteUI] = useSite(siteId);
	const [t] = useCoreTranslation();
	const isFetching = !!siteUI?.isFetching;
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraBreadcrumbs: [useHomeBreadcrumb()],
	});
	const { generatePath, navigate } = useNavigate();
	const navigateToOverview = useCallback(
		() => navigate(`${MODULE_PATHS.root}${MODULE_PATHS.overview}`),
		[navigate]
	);
	const [forceNavigateToOverview] = useOnNextRender(() => navigateToOverview());
	const [{ all: externalTabs, active: activeExternalTab }] = useExternalTabsFacade();
	const activeTabs = useActiveTabs(DETAIL_TABS, externalTabs, location.pathname);
	const { tenantId } = useTenantContext();
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	const pageTitle = `${site?.data?.name ? `'${site?.data?.name}'` : 'Site'} ${t(
		CORE_TRANSLATIONS.ROUTING_UPDATE
	)}`;

	/**
	 * Methods
	 */
	const upsertExternalToBody = (
		site: SiteDetailModel,
		sectionData: ExternalTabValue,
		tab: Tab
	): any => {
		const oldModulesConfig = site?.data.modulesConfig || [];
		const moduleConfigIndex = (oldModulesConfig || []).findIndex(c => c.name === tab.id);
		const moduleConfig: ModuleSettings | Partial<ModuleSettings> = oldModulesConfig[
			moduleConfigIndex
		]
			? { ...oldModulesConfig[moduleConfigIndex] }
			: {
					name: tab.id,
					label: activeExternalTab?.label,
			  };

		moduleConfig.config = sectionData.config;
		moduleConfig.validationSchema = sectionData.validationSchema;

		const newModulesConfig = [...oldModulesConfig];

		if (moduleConfigIndex >= 0) {
			newModulesConfig[moduleConfigIndex] = moduleConfig as ModuleSettings;
		} else {
			newModulesConfig.push(moduleConfig as ModuleSettings);
		}

		return {
			...site.data,
			modulesConfig: newModulesConfig,
		};
	};

	const getRequestBody = (
		sectionData: SitesDetailFormState | ExternalTabValue,
		tab: Tab
	): SitesDetailData | null => {
		let body = null;

		if (!site) {
			return null;
		}

		if (tab.type === TabTypes.EXTERNAL) {
			body = upsertExternalToBody(site, sectionData as ExternalTabValue, tab);
		} else {
			const { name, contentTypes, url } = sectionData as SitesDetailFormState;
			return {
				...site.data,
				name,
				description: name,
				contentTypes,
				url,
				languages: [],
			};
		}

		return body;
	};

	const onSubmit = async (data: SitesDetailFormState, tab: Tab): Promise<void> => {
		const request = getRequestBody(data, tab);

		if (!siteId || !request) {
			return;
		}

		await sitesFacade
			.updateSite({
				id: siteId,
				body: request,
			})
			.then(() => forceNavigateToOverview());
	};

	/**
	 * Render
	 */
	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			site,
			siteUI,
			onSubmit,
			onCancel: () => forceNavigateToOverview(),
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	return (
		<>
			<ContextHeader
				linkProps={(props: ContextHeaderTabLinkProps) => {
					const to = generatePath(`${MODULE_PATHS.root}${MODULE_PATHS.detailExternal}`, {
						siteId,
						tab: props.href,
					});
					return {
						...props,
						to,
						component: Link,
					};
				}}
				tabs={activeTabs}
				title={pageTitle}
				badges={BADGES}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.update}
				/>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.fetchOne}
				/>
				<DataLoader loadingState={isFetching} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default SitesDetail;
