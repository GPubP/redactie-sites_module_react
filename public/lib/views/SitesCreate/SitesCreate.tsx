import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC } from 'react';

import { SitesDetailForm } from '../../components';
import { useHomeBreadcrumb, useRoutes, useSitesLoadingStates, useNavigate } from '../../hooks';
import { generateDetailFormState } from '../../services/helpers';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../sites.const';
import { SitesDetailFormState, SitesRouteProps, Tab } from '../../sites.types';
import { sitesService } from '../../store/sites';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];

const SitesCreate: FC<SitesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const routes = useRoutes();
	const { navigate } = useNavigate();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraBreadcrumbs: [useHomeBreadcrumb()],
	});
	const sitesLoadingStates = useSitesLoadingStates();

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(`${MODULE_PATHS.root}${MODULE_PATHS.overview}`);
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
