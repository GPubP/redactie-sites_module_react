import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DataLoader, SitesDetailForm } from '../../components';
import { useRoutes } from '../../hooks';
import { getSiteById, updateSite, updateSiteActivation } from '../../services/sites';
import { BREADCRUMB_OPTIONS } from '../../sites.const';
import { LoadingState, SitesDetailFormState, SitesRouteProps, Tab } from '../../sites.types';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];

const SitesCreate: FC<SitesRouteProps> = ({ history, tenantId }) => {
	const { siteId } = useParams();

	/**
	 * Hooks
	 */
	const [formState, setFormState] = useState<SitesDetailFormState | null>(null);
	const [siteActivation, setSiteActivation] = useState<boolean>(false);
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [activeToggleLoadingState, setActiveToggleLoadingState] = useState<LoadingState>(
		LoadingState.Loaded
	);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);

	const navigateToOverview = useCallback(() => {
		history.push(`/${tenantId}/sites/beheer`);
	}, [tenantId, history]);

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			if (!siteId) {
				navigateToOverview();
			}

			const response = await getSiteById(siteId as string);

			if (response) {
				setLoadingState(LoadingState.Loaded);
				setFormState({
					name: response.data.name,
					contentTypes: response.data.contentTypes,
				});
				setSiteActivation(response.meta.active);
				return;
			}

			navigateToOverview();
		};

		fetchData();
	}, [navigateToOverview, siteId]);

	/**
	 * Methods
	 */

	const onSubmit = ({ name, contentTypes }: SitesDetailFormState): void => {
		const request = { name, description: name, contentTypes };

		const response = updateSite(siteId as string, request);

		if (response) {
			// Create was succesful, go back to the overview
			navigateToOverview();
		}
	};

	const onActiveToggle = (): void => {
		if (siteId) {
			setActiveToggleLoadingState(LoadingState.Loading);
			updateSiteActivation(siteId, !siteActivation)
				.then(() => setSiteActivation(!siteActivation))
				.finally(() => {
					setActiveToggleLoadingState(LoadingState.Loaded);
				});
		}
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
				active={siteActivation}
				initialState={formState}
				activeLoading={activeToggleLoadingState === LoadingState.Loading}
				onCancel={navigateToOverview}
				onSubmit={onSubmit}
				onActiveToggle={onActiveToggle}
			/>
		);
	};

	return (
		<>
			<ContextHeader tabs={TABS} title="Site bewerken">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={loadingState} render={renderSitesUpdate} />
			</Container>
		</>
	);
};

export default SitesCreate;
