import { Button, TextField } from '@acpaas-ui/react-components';
import { ContextHeader } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import kebabCase from 'lodash.kebabcase';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { createSite } from '../../sites.service';
import { SitesRouteProps } from '../../sites.types';
import { Tab } from '../../types';

import { SitesCreateFormState } from './SitesCreate.types';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];

const SitesCreate: FC<SitesRouteProps> = ({ basePath }) => {
	/**
	 * Hooks
	 */
	const history = useHistory();

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(`${basePath}/beheer`);
	};

	const onSubmit = ({ name }: SitesCreateFormState): void => {
		const request = { name, description: name };
		const response = createSite(request);

		if (response) {
			// Create was succesful, go back to the overview
			navigateToOverview();
		}
	};

	/**
	 * Render
	 */
	return (
		<>
			<ContextHeader tabs={TABS} title="Site aanmaken" />
			<div className="u-margin-top">
				{/* TODO: add validation scheme with yup */}
				<Formik initialValues={{ name: '' }} onSubmit={onSubmit}>
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
								<Button onClick={navigateToOverview} outline>
									Annuleer
								</Button>
							</div>
						</>
					)}
				</Formik>
			</div>
		</>
	);
};

export default SitesCreate;
