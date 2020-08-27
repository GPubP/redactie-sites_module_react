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
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { useDetectValueChanges } from '@redactie/utils';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC, ReactElement, useState } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import { SitesDetailFormState } from '../../sites.types';
import SitesStatus from '../SiteStatus/SiteStatus';

import { SITES_DETAIL_VALIDATION_SCHEMA } from './SitesDetailForm.const';
import { SitesDetailFormProps } from './SitesDetailForm.types';

const SitesDetailForm: FC<SitesDetailFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
	onActiveToggle,
	onArchive,
	activeLoading,
	active,
	loading,
}) => {
	const [t] = useCoreTranslation();
	const [formValue, setFormValue] = useState<SitesDetailFormState | null>(null);
	const [isChanged] = useDetectValueChanges(!loading, formValue);

	const renderArchive = (): ReactElement => {
		const loadingStateButtonProps = activeLoading
			? {
					iconLeft: 'circle-o-notch fa-spin',
					disabled: true,
			  }
			: null;
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
					{active ? (
						<Button
							{...loadingStateButtonProps}
							onClick={onActiveToggle}
							className="u-margin-top u-margin-right"
							type="primary"
						>
							{t('BUTTON_DEACTIVATE')}
						</Button>
					) : (
						<Button
							{...loadingStateButtonProps}
							onClick={onActiveToggle}
							className="u-margin-top u-margin-right"
							type="primary"
						>
							{t('BUTTON_ACTIVATE')}
						</Button>
					)}

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
									{...loadingStateButtonProps}
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
			initialValues={initialState}
			onSubmit={onSubmit}
			validationSchema={SITES_DETAIL_VALIDATION_SCHEMA}
		>
			{({ submitForm, values }) => {
				setFormValue(values);

				return (
					<>
						<div className="row u-margin-bottom">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field as={TextField} label="Naam" name="name" required />
								</div>

								<div className="col-xs-12 col-md-4">
									<div className="u-margin-top">
										{t(CORE_TRANSLATIONS['GENERAL_SYSTEM-NAME'])}:{' '}
										<b>
											{onActiveToggle
												? initialState?.name || ''
												: kebabCase(values.name)}
										</b>
									</div>
								</div>
								<div className="col-xs-12 u-text-light u-margin-top-xs">
									Geef de site een korte en duidelijke naam. Deze naam verschijnt
									in de applicatie.
								</div>
							</div>
						</div>
						<div className="row u-margin-bottom">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field as={TextField} label="URL" name="url" required />
								</div>
								<div className="col-xs-12 u-text-light u-margin-top-xs">
									Locatie van de website.
								</div>
							</div>
						</div>
						{onActiveToggle ? renderArchive() : null}
						<ActionBar className="o-action-bar--fixed" isOpen>
							<ActionBarContentSection>
								<div className="u-wrapper row end-xs">
									<Button onClick={onCancel} negative>
										{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
									</Button>
									<Button
										iconLeft={loading ? 'circle-o-notch fa-spin' : null}
										disabled={loading || !isChanged}
										className="u-margin-left-xs"
										onClick={() => submitForm()}
										type="success"
									>
										{onActiveToggle
											? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
											: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
									</Button>
								</div>
							</ActionBarContentSection>
						</ActionBar>
					</>
				);
			}}
		</Formik>
	);
};

export default SitesDetailForm;
