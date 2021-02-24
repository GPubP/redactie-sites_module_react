import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	LeavePrompt,
	LoadingState,
	useDetectValueChanges,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { SitesDetailForm } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useHomeBreadcrumb, useSitesLoadingStates } from '../../hooks';
import { SiteResponse } from '../../services/sites';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	DETAIL_TABS,
	MODULE_PATHS,
} from '../../sites.const';
import { SitesDetailFormState, SitesRouteProps } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

import { INITIAL_DETAIL_FORM_STATE, SITES_CREATE_ALLOWED_PATHS } from './SitesCreate.const';

const SitesCreate: FC<SitesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const routes = useRoutes();
	const { generatePath, navigate } = useNavigate();
	const [t] = useCoreTranslation();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraBreadcrumbs: [useHomeBreadcrumb()],
	});
	const sitesLoadingStates = useSitesLoadingStates();
	const [formValue, setFormValue] = useState<SitesDetailFormState>(INITIAL_DETAIL_FORM_STATE());
	const [isChanged, resetDetectValueChanges] = useDetectValueChanges(!!formValue, formValue);

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
			<ContextHeader
				linkProps={(props: any) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.root}${MODULE_PATHS.create}`),
					component: Link,
				})}
				tabs={DETAIL_TABS}
				title={`Site ${t(CORE_TRANSLATIONS.ROUTING_CREATE)}`}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<div className="u-margin-bottom">
					<AlertContainer containerId={ALERT_CONTAINER_IDS.create} />
				</div>
				<SitesDetailForm
					isChanged={isChanged}
					onChange={setFormValue}
					initialState={formValue}
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
