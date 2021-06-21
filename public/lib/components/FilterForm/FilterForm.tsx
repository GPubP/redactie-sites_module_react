import { Select, TextField } from '@acpaas-ui/react-components';
import { Filter, FilterBody } from '@acpaas-ui/react-editorial-components';
import { Field, Form, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';

import { FILTER_FORM_VALIDATION_SCHEMA, STATUS_OPTIONS } from './FilterForm.const';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	initialState,
	onCancel,
	onSubmit,
	activeFilters,
	deleteActiveFilter,
}) => {
	/**
	 * Hooks
	 */
	const [t] = useCoreTranslation();

	/**
	 * Render
	 */
	return (
		<Formik
			enableReinitialize
			initialValues={initialState}
			onSubmit={onSubmit}
			validationSchema={FILTER_FORM_VALIDATION_SCHEMA}
		>
			{({ submitForm }) => {
				return (
					<Form>
						<Filter
							title={t(CORE_TRANSLATIONS.FILTER_TITLE)}
							noFilterText="Geen filters beschikbaar"
							onConfirm={submitForm}
							onClean={onCancel}
							confirmText={t(CORE_TRANSLATIONS.FILTER_APPLY)}
							cleanText={t(CORE_TRANSLATIONS.FILTER_CLEAR)}
							activeFilters={activeFilters}
							onFilterRemove={deleteActiveFilter}
						>
							<FilterBody>
								<div className="col-xs-12 col-md-6 u-margin-bottom">
									<Field
										as={TextField}
										label="Naam"
										name="name"
										required
										placeholder="Zoeken op naam"
										iconright="search"
									/>
								</div>
								<div className="col-xs-12 col-md-6 sm:u-margin-bottom">
									<Field
										as={Select}
										label="Status"
										name="status"
										options={STATUS_OPTIONS(t)}
										placeholder="Status"
									/>
								</div>
							</FilterBody>
						</Filter>
					</Form>
				);
			}}
		</Formik>
	);
};

export default FilterForm;
