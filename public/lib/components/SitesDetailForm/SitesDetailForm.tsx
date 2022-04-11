import { Button, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	LanguageHeaderContext,
} from '@acpaas-ui/react-editorial-components';
import {
	CopyValue,
	DataLoader,
	ErrorMessage,
	FormikMultilanguageField,
	FormikOnChangeHandler,
	handleMultilanguageFormErrors,
	LoadingState,
} from '@redactie/utils';
import { Field, Formik, FormikErrors, FormikValues } from 'formik';
import { pathOr } from 'ramda';
import React, { FC, ReactElement, useContext } from 'react';

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
	activeLanguage,
}) => {
	const [t] = TranslationsConnector.useCoreTranslation();
	const { setErrors } = useContext(LanguageHeaderContext);

	const handleOnError = (values: any, formErrors: FormikErrors<FormikValues>): void => {
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
					const { submitForm, resetForm, errors } = formikProps;
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

							<div className="u-margin-bottom">
								<FormikMultilanguageField
									className="u-w-50"
									description="Locatie van de website."
									asComponent={TextField}
									label="URL"
									name="url"
									required
									state={
										activeLanguage &&
										pathOr(null, ['url', activeLanguage.key])(errors) &&
										'error'
									}
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
		);
	};
	return <DataLoader loadingState={loadingState || LoadingState.Loaded} render={renderForm} />;
};

export default SitesDetailForm;
