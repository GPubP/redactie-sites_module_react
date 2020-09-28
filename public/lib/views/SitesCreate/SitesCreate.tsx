import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { equals } from 'ramda';
import React, { FC, useMemo, useState } from 'react';

import { SitesDetailForm } from '../../components';
import { useHomeBreadcrumb, useNavigate, useRoutes, useSitesLoadingStates } from '../../hooks';
import { generateDetailFormState } from '../../services/helpers';
import { SiteResponse } from '../../services/sites';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../sites.const';
import { LoadingState, SitesDetailFormState, SitesRouteProps, Tab } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];
const initialFormValue = generateDetailFormState();

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
	const [formValue, setFormValue] = useState<SitesDetailFormState>(initialFormValue);
	const isChanged = useMemo(() => !equals(initialFormValue, formValue), [formValue]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(`${MODULE_PATHS.root}${MODULE_PATHS.overview}`);
	};

	const onSubmit = ({ name, contentTypes, url }: SitesDetailFormState): void => {
		const request = { name, description: name, contentTypes, url };

		sitesFacade
			.createSite(request)
			.then(site => {
				if (!(site as SiteResponse)?.uuid) {
					return;
				}

				navigate(`${MODULE_PATHS.root}${MODULE_PATHS.detailEdit}`, {
					siteId: (site as SiteResponse)?.uuid,
				});
			})
			.catch(error => console.log(error));
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
					isChanged={isChanged}
					onChange={setFormValue}
					initialState={initialFormValue}
					loading={sitesLoadingStates.isCreating === LoadingState.Loading}
					onCancel={navigateToOverview}
					onSubmit={onSubmit}
				/>
			</Container>
		</>
	);
};

export default SitesCreate;
