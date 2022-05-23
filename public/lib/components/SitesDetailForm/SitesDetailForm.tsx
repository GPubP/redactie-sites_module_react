import { Button, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	LanguageHeaderContext,
} from '@acpaas-ui/react-editorial-components';
import { LanguageSchema } from '@redactie/language-module';
import {
	CopyValue,
	DataLoader,
	ErrorMessage,
	FormikMultilanguageField,
	FormikOnChangeHandler,
	handleMultilanguageFormErrors,
	Language,
	LoadingState,
} from '@redactie/utils';
import { Field, Formik, FormikErrors, FormikValues } from 'formik';
import { equals, pathOr } from 'ramda';
import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
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
	loadingState,
	activeLanguages,
	onActiveToggle,
	multiLang,
}) => {
	const { siteId } = useParams<{ siteId: string }>();
	const [t] = TranslationsConnector.useCoreTranslation();
	const [formikErrors, setFormikErrors] = useState<FormikErrors<FormikValues>>({});

	const [, languages] = languagesConnector.hooks.useActiveLanguagesForSite(siteId);
	const [primaryLanguage, setPrimaryLanguage] = useState<Language | LanguageSchema | any>();
	const { setErrors, activeLanguage } = useContext(LanguageHeaderContext);

	useEffect(() => {
		if (Array.isArray(languages) && !primaryLanguage) {
			setPrimaryLanguage(languages.find(l => l.primary) || languages[0]);
		}
	}, [primaryLanguage, languages]);

	const handleOnError = (values: any, formErrors: FormikErrors<FormikValues>): void => {
		if (equals(formErrors, formikErrors)) {
			return;
		}

		setFormikErrors(formikErrors);
		onChange(values as SitesDetailFormState);

		const newErrors = handleMultilanguageFormErrors(formErrors, values);
		setErrors(newErrors);
	};

	const renderForm = (): ReactElement | null => {
		if (!activeLanguages) {
			return null;
		}

		return (
			<Formik
				enableReinitialize
				initialValues={initialState}
				onSubmit={onSubmit}
				validationSchema={() => SITES_DETAIL_VALIDATION_SCHEMA(activeLanguages)}
			>
				{formikProps => {
					const { submitForm, resetForm, errors, values } = formikProps;
					return (
						<>
							<FormikOnChangeHandler
								onChange={values => onChange(values as SitesDetailFormState)}
								onError={handleOnError}
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

							{activeLanguage ? (
								<div className="u-margin-bottom">
									<FormikMultilanguageField
										className="u-w-50"
										description="Locatie van de website."
										asComponent={TextField}
										label="URL"
										name="url"
										multiLang={multiLang}
										value={
											values?.url?.[activeLanguage?.key] === undefined
												? (primaryLanguage?.key &&
														values?.url?.[primaryLanguage?.key]) ||
												  ''
												: values?.url?.[activeLanguage?.key]
										}
										required
										state={
											activeLanguage &&
											pathOr(null, ['url', activeLanguage.key])(errors) &&
											'error'
										}
									/>
								</div>
							) : (
								<div className="row u-margin-bottom">
									<div className="col-xs-12 col-md-8 row middle-xs">
										<div className="col-xs-12 col-md-8">
											<Field
												description="Locatie van de website."
												as={TextField}
												label="URL"
												name="url"
												required
											/>
											<ErrorMessage name="url" />
										</div>
									</div>
								</div>
							)}

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
		);
	};
	return <DataLoader loadingState={loadingState || LoadingState.Loaded} render={renderForm} />;
};

export default SitesDetailForm;
