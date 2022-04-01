import { Button, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	LanguageHeader,
} from '@acpaas-ui/react-editorial-components';
import { LanguageSchema } from '@redactie/language-module';
import {
	CopyValue,
	DataLoader,
	ErrorMessage,
	FormikMultilanguageField,
	FormikOnChangeHandler,
	Language,
} from '@redactie/utils';
import { Field, Formik } from 'formik';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import languagesConnector from '../../connectors/languages';
import TranslationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { SitesDetailFormState } from '../../sites.types';

import { SITES_DETAIL_VALIDATION_SCHEMA } from './SitesDetailForm.const';
import { SitesDetailFormChildrenFn, SitesDetailFormProps } from './SitesDetailForm.types';

const SitesDetailForm: FC<SitesDetailFormProps> = ({
	initialState,
	loading = false,
	isChanged = false,
	children,
	onChange = () => null,
	onCancel = () => null,
	onSubmit = () => null,
	onActiveToggle,
}) => {
	const [t] = TranslationsConnector.useCoreTranslation();
	const { siteId } = useParams<{ siteId: string }>();
	const [activeLanguage, setActiveLanguage] = useState<Language | LanguageSchema>();
	const [loadingState, languages] = languagesConnector.hooks.useActiveLanguagesForSite(siteId);

	useEffect(() => {
		if (Array.isArray(languages) && !activeLanguage) {
			setActiveLanguage(languages.find(l => l.primary) || languages[0]);
		}
	}, [activeLanguage, languages]);

	const renderForm = (): ReactElement | null => {
		if (!languages) {
			return null;
		}

		return (
			<LanguageHeader
				languages={languages}
				activeLanguage={activeLanguage}
				onChangeLanguage={(language: string) => setActiveLanguage({ key: language })}
			>
				<Formik
					enableReinitialize
					initialValues={initialState}
					onSubmit={onSubmit}
					validationSchema={SITES_DETAIL_VALIDATION_SCHEMA(languages)}
				>
					{formikProps => {
						const { submitForm, resetForm } = formikProps;
						return (
							<>
								<FormikOnChangeHandler
									onChange={values => onChange(values as SitesDetailFormState)}
								/>
								<div className="row u-margin-bottom u-margin-top">
									<div className="col-xs-12 col-md-8 row middle-xs">
										<div className="col-xs-12 col-md-8">
											<Field
												description="Geef de site een korte en duidelijke naam. Deze naam verschijnt in de applicatie."
												as={TextField}
												label="Naam"
												name="name"
												required
											/>
											<ErrorMessage name="name" />
										</div>
									</div>
								</div>
								<div className="row u-margin-bottom">
									<div className="col-xs-12 col-md-8 row middle-xs">
										<div className="col-xs-12 col-md-8">
											{languages.length < 2 ? (
												<>
													<Field
														description="Locatie van de website."
														as={TextField}
														label="URL"
														name="url"
														required
													/>
													<ErrorMessage name="url" />
												</>
											) : (
												<>
													<FormikMultilanguageField
														description="Locatie van de website."
														asComponent={TextField}
														label="URL"
														name="url"
														required
													/>
												</>
											)}
										</div>
									</div>
								</div>
								) : (
									<div className="u-margin-bottom">
										<FormikMultilanguageField
											className="col-xs-12 col-md-6"
											description="Locatie van de website."
											asComponent={TextField}
											label="URL"
											name="url"
											required
										/>
									</div>
								{initialState.uuid && (
									<div className="row u-margin-top">
										<CopyValue
											label="UUID"
											value={initialState.uuid}
											buttonText={t(CORE_TRANSLATIONS.GENERAL_COPY)}
											className="col-xs-12"
										/>
									</div>
								)}
								<ActionBar className="o-action-bar--fixed" isOpen>
									<ActionBarContentSection>
										<div className="u-wrapper row end-xs">
											<Button onClick={() => onCancel(resetForm)} negative>
												{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
											</Button>
											<Button
												iconLeft={loading ? 'circle-o-notch fa-spin' : null}
												disabled={loading || !isChanged}
												className="u-margin-left-xs"
												onClick={submitForm}
												type="success"
											>
												{onActiveToggle
													? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
													: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
											</Button>
										</div>
									</ActionBarContentSection>
								</ActionBar>
								{typeof children === 'function'
									? (children as SitesDetailFormChildrenFn)(formikProps)
									: children}
							</>
						);
					}}
				</Formik>
			</LanguageHeader>
		);
	};
	return <DataLoader loadingState={loadingState} render={renderForm} />;
};

export default SitesDetailForm;
