import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DataLoader, SitesDetailForm } from '../../components';
import {
	useHomeBreadcrumb,
	useNavigate,
	useRoutes,
	useSite,
	useSitesLoadingStates,
} from '../../hooks';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../sites.const';
import { LoadingState, SitesDetailFormState, SitesRouteProps, Tab } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];

const SitesCreate: FC<SitesRouteProps> = () => {
	const { siteId } = useParams();

	/**
	 * Hooks
	 */
	const [formState, setFormState] = useState<SitesDetailFormState | null>(null);
	const routes = useRoutes();
	const { navigate } = useNavigate();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraBreadcrumbs: [useHomeBreadcrumb()],
	});
	const [loadingState, site] = useSite();
	const sitesLoadingStates = useSitesLoadingStates();
	const navigateToOverview = useCallback(
		() => navigate(`${MODULE_PATHS.root}${MODULE_PATHS.overview}`),
		[navigate]
	);

	useEffect(() => {
		if (site) {
			setFormState({
				name: site.data.name,
				contentTypes: site.data.contentTypes,
			});
		}
	}, [site]);

	useEffect(() => {
		if (siteId) {
			sitesFacade.getSite({ id: siteId });
			return;
		}
	}, [siteId]);

	/**
	 * Methods
	 */
	const onSubmit = ({ name, contentTypes }: SitesDetailFormState): void => {
		const request = { name, description: name, contentTypes };

		if (siteId) {
			sitesFacade.updateSite({
				id: siteId,
				body: request,
			});
		}
	};

	const onActiveToggle = (): void => {
		if (siteId && site) {
			sitesFacade.updateSiteActivation({
				id: siteId,
				activate: !site.meta.active,
			});
		}
	};

	const onArchive = (): void => {
		sitesFacade.archiveSite(siteId).then(() => navigateToOverview());
	};

	/**
	 * Render
	 */
	const renderSitesUpdate = (): ReactElement | null => {
		if (!formState) {
			return null;
		}

		return (
			<SitesDetailForm
				active={site?.meta.active}
				initialState={formState}
				activeLoading={sitesLoadingStates.isActivating === LoadingState.Loading}
				loading={
					sitesLoadingStates.isUpdating === LoadingState.Loading ||
					sitesLoadingStates.isArchiving === LoadingState.Loading
				}
				onCancel={navigateToOverview}
				onSubmit={onSubmit}
				onActiveToggle={onActiveToggle}
				onArchive={onArchive}
			/>
		);
	};

	return (
		<>
			<ContextHeader tabs={TABS} title={`${site?.data.name || ''} bewerken`}>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={loadingState} render={renderSitesUpdate} />
			</Container>
		</>
	);
};

export default SitesCreate;
