import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	CheckboxList,
	LeavePrompt,
	useDetectValueChanges,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import { Field } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { SitesDetailForm } from '../../components';
import languagesConnector from '../../connectors/languages';
import TranslationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { useHomeBreadcrumb, useSitesUIStates } from '../../hooks';
import { SiteResponse } from '../../services/sites';
import { BREADCRUMB_OPTIONS, DETAIL_TABS, MODULE_PATHS } from '../../sites.const';
import { ALERT_CONTAINER_IDS, SitesDetailFormState, SitesRouteProps } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

import { INITIAL_DETAIL_FORM_STATE, SITES_CREATE_ALLOWED_PATHS } from './SitesCreate.const';

const SitesCreate: FC<SitesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const routes = useRoutes();
	const { generatePath, navigate } = useNavigate();
	const [t] = TranslationsConnector.useCoreTranslation();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraBreadcrumbs: [useHomeBreadcrumb()],
	});
	const [siteListUIState] = useSitesUIStates();
	const [formValue, setFormValue] = useState<SitesDetailFormState>(INITIAL_DETAIL_FORM_STATE());
	const [isChanged, resetDetectValueChanges] = useDetectValueChanges(!!formValue, formValue);
	const [, , , languages] = languagesConnector.hooks.useLanguages();

	useEffect(() => {
		languagesConnector.languagesFacade.getLanguages({
			active: true,
		});
	}, []);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(`${MODULE_PATHS.root}${MODULE_PATHS.overview}`);
	};

	const onSubmit = ({ name, contentTypes, url, languages }: SitesDetailFormState): void => {
		const request = { name, description: name, contentTypes, url, languages };

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
					loading={siteListUIState.isCreating}
					onCancel={navigateToOverview}
					onSubmit={onSubmit}
				>
					{({ submitForm }) => (
						<>
							<Field
								as={CheckboxList}
								name="languages"
								label="Talen"
								description="Activeer minstens één taal voor deze website. Voeg extra talen toe in het menu"
								options={(languages || [])?.map(language => ({
									key: language.uuid,
									value: language.uuid,
									label: `${language.name} (${language.key})`,
								}))}
							/>
							<LeavePrompt
								shouldBlockNavigationOnConfirm
								when={isChanged}
								allowedPaths={SITES_CREATE_ALLOWED_PATHS}
								confirmText="Ja, bewaar en ga verder"
								onConfirm={submitForm}
							/>
						</>
					)}
				</SitesDetailForm>
			</Container>
		</>
	);
};

export default SitesCreate;
