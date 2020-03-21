import { Button, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';

import { SitesDetailFormState } from '../../sites.types';

interface SitesDetailFormProps {
	initialState: SitesDetailFormState;
	onCancel: () => void;
	onSubmit: (values: SitesDetailFormState) => void;
}

const SitesDetailForm: FC<SitesDetailFormProps> = ({ initialState, onCancel, onSubmit }) => {
	// TODO: add validation scheme with yup
	return (
		<Formik initialValues={initialState} onSubmit={onSubmit}>
			{({ submitForm, values }) => (
				<>
					<Field as={TextField} label="Naam" name="name" required />
					<p>
						Systeemnaam: <b>{kebabCase(values.name)}</b>
					</p>
					{/* TODO: these should go in the action bar */}
					<div className="u-margin-top">
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
					</div>
				</>
			)}
		</Formik>
	);
};

export default SitesDetailForm;
