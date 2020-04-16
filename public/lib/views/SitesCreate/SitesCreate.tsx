import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC } from 'react';

import { SitesDetailForm } from '../../components';
import { useRoutes, useSitesLoadingStates } from '../../hooks';
import { generateDetailFormState } from '../../services/helpers';
import { BREADCRUMB_OPTIONS } from '../../sites.const';
import { SitesDetailFormState, SitesRouteProps, Tab } from '../../sites.types';
import { sitesService } from '../../store/sites';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];

const SitesCreate: FC<SitesRouteProps> = ({ basePath, history }) => {
	/**
	 * Hooks
	 */
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const sitesLoadingStates = useSitesLoadingStates();

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(`${basePath}/beheer`);
	};

	const onSubmit = ({ name, contentTypes }: SitesDetailFormState): void => {
		const request = { name, description: name, contentTypes };
		sitesService.createSite(request).then(() => {
			navigateToOverview();
		});
	};

	/**
	 * Render
	 */
	return (
		<>
			<ContextHeader tabs={TABS} title="Site aanmaken">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<SitesDetailForm
					initialState={generateDetailFormState()}
					loading={sitesLoadingStates.isCreating}
					onCancel={navigateToOverview}
					onSubmit={onSubmit}
				/>
			</Container>
		</>
	);
};

export default SitesCreate;
