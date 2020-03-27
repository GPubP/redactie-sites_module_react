import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	TextField,
} from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC, ReactElement } from 'react';

import Status from '../Status/Status';

import { SITES_DETAIL_VALIDATION_SCHEMA } from './SitesDetailForm.const';
import { SitesDetailFormProps } from './SitesDetailForm.types';

const SitesDetailForm: FC<SitesDetailFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
	onActiveToggle,
}) => {
	const renderArchive = (): ReactElement => {
		return (
			<Card className="u-margin-top">
				<CardBody>
					<CardTitle>
						Status: <Status label="Actief" type="ACTIVE"></Status>
					</CardTitle>
					<CardDescription>
						Bepaal of deze site actief is of niet. Het gevolg hiervan is of de site en
						zijn content en/of content types al dan niet beschikbaar zijn.
					</CardDescription>
					<Button className="u-margin-top" type="danger" outline>
						Deactiveren
					</Button>
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
					{/* TODO: these should go in the action bar */}
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
				</>
			)}
		</Formik>
	);
};

export default SitesDetailForm;
