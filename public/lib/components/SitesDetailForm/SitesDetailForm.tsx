import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	TextField,
} from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC, ReactElement } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import SitesStatus from '../SiteStatus/SiteStatus';

import { SITES_DETAIL_VALIDATION_SCHEMA } from './SitesDetailForm.const';
import { SitesDetailFormProps } from './SitesDetailForm.types';

const SitesDetailForm: FC<SitesDetailFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
	onActiveToggle,
	activeLoading,
	active,
	loading,
}) => {
	const [t] = useCoreTranslation();

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
							className="u-margin-top"
							type="danger"
							outline
						>
							{t('BUTTON_DEACTIVATE')}
						</Button>
					) : (
						<Button
							{...loadingStateButtonProps}
							onClick={onActiveToggle}
							className="u-margin-top"
							type="success"
							outline
						>
							{t('BUTTON_ACTIVATE')}
						</Button>
					)}
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
			{({ submitForm, values }) => (
				<>
					<div className="row u-margin-bottom">
						<div className="col-xs-12 col-md-8 row middle-xs">
							<div className="col-xs-12 col-md-8">
								<Field as={TextField} label="Naam" name="name" required />
							</div>

							<div className="col-xs-12 col-md-4">
								<div className="u-margin-top">
									{t(CORE_TRANSLATIONS['GENERAL_SYSTEM-NAME'])}:{' '}
									<b>{kebabCase(values.name)}</b>
								</div>
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
									disabled={loading}
									className="u-margin-left-xs"
									onClick={() => submitForm()}
									type="success"
								>
									{t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
								</Button>
							</div>
						</ActionBarContentSection>
					</ActionBar>
				</>
			)}
		</Formik>
	);
};

export default SitesDetailForm;
