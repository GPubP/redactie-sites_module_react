import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
	LanguageHeader,
} from '@acpaas-ui/react-editorial-components';
import { LanguageSchema } from '@redactie/language-module';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	CheckboxList,
	FormikOnChangeHandler,
	Language,
	LeavePrompt,
	useDetectValueChanges,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import { Field } from 'formik';
import React, { FC, useEffect, useMemo, useState } from 'react';
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
	const [activeLanguage, setActiveLanguage] = useState<Language | LanguageSchema>();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraBreadcrumbs: [useHomeBreadcrumb()],
	});
	const [siteListUIState] = useSitesUIStates();
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
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

	useEffect(() => {
		if (Array.isArray(languages) && !activeLanguage) {
			const primaryLang = languages.find(l => l.primary) || languages[0];

			setActiveLanguage(primaryLang);
			setSelectedLanguages([primaryLang.uuid]);
		}
	}, [activeLanguage, languages]);

	const activeLanguages: LanguageSchema[] = useMemo(
		() =>
			selectedLanguages.length
				? (languages || [])?.filter(lang => selectedLanguages.includes(lang.uuid))
				: languages?.length
				? [languages.find(l => l.primary) || languages[0]]
				: [],
		[languages, selectedLanguages]
	);
	const languageOptions = useMemo(
		() =>
			(languages || [])?.map(language => ({
				key: language.uuid,
				value: language.uuid,
				label: `${language.name} (${language.key})`,
			})),
		[languages]
	);

	const handleLanguageChange = (languages: string[]): void => {
		setSelectedLanguages(languages);

		if (!languages.includes((activeLanguage as LanguageSchema)?.uuid)) {
			setActiveLanguage(activeLanguages[0]);
		}
	};

	const handleActiveLanguageChange = (languageKey: string): void => {
		const language = activeLanguages.find(activeLanguage => activeLanguage.key === languageKey);

		setActiveLanguage(language || { key: languageKey });
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
				<LanguageHeader
					languages={activeLanguages}
					activeLanguage={activeLanguage}
					onChangeLanguage={handleActiveLanguageChange}
				>
					<SitesDetailForm
						isChanged={isChanged}
						onChange={setFormValue}
						initialState={formValue}
						loading={siteListUIState.isCreating}
						onCancel={navigateToOverview}
						onSubmit={onSubmit}
						activeLanguages={activeLanguages}
						activeLanguage={activeLanguage}
						multiLang={activeLanguages && activeLanguages?.length > 1 && true}
					>
						{({ submitForm }) => (
							<>
								<FormikOnChangeHandler
									onChange={({ languages }) => handleLanguageChange(languages)}
								/>
								<Field
									as={CheckboxList}
									name="languages"
									label="Talen"
									description="Activeer minstens één taal voor deze website. Voeg extra talen toe in het menu"
									options={languageOptions}
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
				</LanguageHeader>
			</Container>
		</>
	);
};

export default SitesCreate;
