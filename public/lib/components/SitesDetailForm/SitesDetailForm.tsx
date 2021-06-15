import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	Modal,
	TextField,
} from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { CopyValue, ErrorMessage, FormikOnChangeHandler } from '@redactie/utils';
import { Field, Formik } from 'formik';
import React, { FC, ReactElement } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { SitesDetailFormState } from '../../sites.types';
import SitesStatus from '../SiteStatus/SiteStatus';

import { SITES_DETAIL_VALIDATION_SCHEMA } from './SitesDetailForm.const';
import { SitesDetailFormChildrenFn, SitesDetailFormProps } from './SitesDetailForm.types';

const SitesDetailForm: FC<SitesDetailFormProps> = ({
	initialState,
	activeLoading = false,
	archiveLoading = false,
	active = false,
	loading = false,
	isChanged = false,
	children,
	onChange = () => null,
	onCancel = () => null,
	onSubmit = () => null,
	onArchive = () => null,
	onActiveToggle,
}) => {
	const [t] = useCoreTranslation();

	const getLoadingStateBtnProps = (
		loading: boolean,
		defaultIcon?: string
	): { iconLeft: string; disabled: boolean } | null => {
		if (loading) {
			return {
				iconLeft: 'circle-o-notch fa-spin',
				disabled: true,
			};
		}

		if (defaultIcon) {
			return {
				iconLeft: defaultIcon,
				disabled: false,
			};
		}

		return null;
	};

	const renderArchive = (): ReactElement => {
		return (
			<Card>
				<CardBody>
					<CardTitle>
						Status: <SitesStatus active={!!active} />
					</CardTitle>
					<CardDescription>
						Bepaal of deze site actief is of niet. Het gevolg hiervan is of de site en
						zijn content en/of content types al dan niet beschikbaar zijn.
					</CardDescription>
					<Button
						{...getLoadingStateBtnProps(activeLoading)}
						onClick={onActiveToggle}
						className="u-margin-top u-margin-right-xs"
						type="primary"
					>
						{active ? t('BUTTON_DEACTIVATE') : t('BUTTON_ACTIVATE')}
					</Button>

					{/**
					 * TODO: move this to editorial-ui with proper div class handling and also make buttons configurable
					 */}
					<div style={{ display: 'inline-block' }}>
						<Modal
							appElement="#root"
							title="Ben je zeker dat je deze site wil archiveren?"
							confirmText={t('MODAL_CONFIRM-ARCHIVE')}
							denyText={t('MODAL_CANCEL')}
							shouldCloseOnEsc={true}
							shouldCloseOnOverlayClick={true}
							onConfirm={onArchive}
							triggerElm={
								<Button
									{...getLoadingStateBtnProps(archiveLoading, 'archive')}
									onClick={onArchive}
									className="u-margin-top"
									type="danger"
								>
									{t('BUTTON_ARCHIVE')}
								</Button>
							}
						>
							<p>
								De site archiveren betekent dat alle gegevens gekoppeld aan de site
								ook gearchiveerd worden. Deze actie kan niet ongedaan gemaakt worden
								zonder input van een systeem beheerder.
							</p>
						</Modal>
					</div>
				</CardBody>
			</Card>
		);
	};

	return (
		<Formik
			enableReinitialize
			initialValues={initialState}
			onSubmit={onSubmit}
			validationSchema={SITES_DETAIL_VALIDATION_SCHEMA}
		>
			{formikProps => {
				const { submitForm, resetForm } = formikProps;
				return (
					<>
						<FormikOnChangeHandler
							onChange={values => onChange(values as SitesDetailFormState)}
						/>
						<div className="row u-margin-bottom">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										description="Geef de site een korte en duidelijke naam. Deze naam verschijnt
									in de applicatie."
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
						{onActiveToggle ? renderArchive() : null}
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

export default SitesDetailForm;
