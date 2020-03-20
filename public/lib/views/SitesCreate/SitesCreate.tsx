import { TextField } from '@acpaas-ui/react-components';
import { ContextHeader } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Tab } from '../../types';

import { SitesCreateFormState } from './SitesCreate.types';

const SitesCreate: FC = () => {
	/**
	 * Hooks
	 */
	const { tabId } = useParams();
	console.log(tabId);

	const tabs = useMemo<Tab[]>(
		() => [{ name: 'Instellingen', target: 'instellingen', active: tabId === 'instellingen' }],
		[tabId]
	);

	/**
	 * Methodq
	 */
	const onSubmit = (values: SitesCreateFormState): void => {
		console.log(values);
	};

	/**
	 * Render
	 */
	return (
		<>
			<ContextHeader tabs={tabs} title="Site aanmaken" />
			<p>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto maiores minus
				laborum necessitatibus dolore tempore aspernatur provident vel aliquid. Tenetur,
				quod fugit! Quo provident dolore ratione placeat quae harum nihil?
			</p>
			<div className="u-container">
				<Formik initialValues={{ name: '' }} onSubmit={onSubmit}>
					<Field component={TextField} name="name" required />
				</Formik>
			</div>
		</>
	);
};

export default SitesCreate;
