import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import React, { FC } from 'react';

import { SitesDetailForm } from '../../components';
import useRoutes from '../../hooks/useRoutes/useRoutes';
import { generateDetailFormState } from '../../services/helpers';
import { createSite } from '../../services/sites';
import { BREADCRUMB_OPTIONS } from '../../sites.const';
import { SitesDetailFormState, SitesRouteProps, Tab } from '../../sites.types';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];

const SitesCreate: FC<SitesRouteProps> = ({ basePath, history }) => {
	/**
	 * Hooks
	 */
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(`${basePath}/beheer`);
	};

	const onSubmit = ({ name }: SitesDetailFormState): void => {
		const request = { name, description: name };
		const response = createSite(request);

		if (response) {
			// Create was succesful, go back to the overview
			navigateToOverview();
		}
	};

	/**
	 * Render
	 */
	return (
		<>
			<ContextHeader tabs={TABS} title="Site aanmaken">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<div className="u-margin-top u-container u-wrapper">
				<SitesDetailForm
					initialState={generateDetailFormState()}
					onCancel={navigateToOverview}
					onSubmit={onSubmit}
				/>
			</div>
		</>
	);
};

export default SitesCreate;
