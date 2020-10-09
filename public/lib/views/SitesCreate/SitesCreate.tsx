import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { AlertContainer, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import React, { FC, useState } from 'react';

import { SitesDetailForm } from '../../components';
import { useHomeBreadcrumb, useNavigate, useRoutes, useSitesLoadingStates } from '../../hooks';
import { generateDetailFormState } from '../../services/helpers';
import { SiteResponse } from '../../services/sites';
import { ALERT_CONTAINER_IDS, BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../sites.const';
import { LoadingState, SitesDetailFormState, SitesRouteProps, Tab } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

import { SITES_CREATE_ALLOWED_PATHS } from './SitesCreate.const';

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
	const [isChanged, resetDetectValueChanges] = useDetectValueChanges(
		!!initialFormValue,
		formValue
	);

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
				resetDetectValueChanges();
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
				<div className="u-margin-bottom">
					<AlertContainer containerId={ALERT_CONTAINER_IDS.create} />
				</div>
				<SitesDetailForm
					isChanged={isChanged}
					onChange={setFormValue}
					initialState={initialFormValue}
					loading={sitesLoadingStates.isCreating === LoadingState.Loading}
					onCancel={navigateToOverview}
					onSubmit={onSubmit}
				>
					{({ submitForm }) => (
						<LeavePrompt
							shouldBlockNavigationOnConfirm
							when={isChanged}
							allowedPaths={SITES_CREATE_ALLOWED_PATHS}
							confirmText="Ja, bewaar en ga verder"
							onConfirm={submitForm}
						/>
					)}
				</SitesDetailForm>
			</Container>
		</>
	);
};

export default SitesCreate;
