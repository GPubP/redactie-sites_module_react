import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	TextField,
} from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC, ReactElement } from 'react';

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
}) => {
	const renderArchive = (): ReactElement => {
		const loadingStateButtonProps = activeLoading
			? {
					iconLeft: 'circle-o-notch fa-spin',
					disabled: true,
			  }
			: null;
		return (
			<Card className="u-margin-top">
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
							Deactiveren
						</Button>
					) : (
						<Button
							{...loadingStateButtonProps}
							onClick={onActiveToggle}
							className="u-margin-top"
							type="success"
							outline
						>
							Activeren
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
					<div className="row">
						<div className="col-xs-12 col-md-8 row middle-xs">
							<div className="col-xs-12 col-md-8">
								<Field as={TextField} label="Naam" name="name" required />
							</div>

							<div className="col-xs-12 col-md-4">
								<div className="u-margin-top">
									Systeemnaam: <b>{kebabCase(values.name)}</b>
								</div>
							</div>
						</div>
					</div>
					{onActiveToggle ? renderArchive() : null}
					<ActionBar className="o-action-bar" isOpen>
						<ActionBarContentSection>
							<Button
								className="u-margin-right-xs"
								onClick={() => submitForm()}
								type="success"
							>
								Bewaar en ga verder
							</Button>
							<Button onClick={onCancel} outline>
								Annuleer
							</Button>
						</ActionBarContentSection>
					</ActionBar>
				</>
			)}
		</Formik>
	);
};

export default SitesDetailForm;
