/* eslint-disable react/display-name */
import { Button } from '@acpaas-ui/react-components';
import { LanguageModel } from '@redactie/language-module';
import { TableColumn } from '@redactie/utils';
import { FieldArrayRenderProps } from 'formik';
import React from 'react';

import { SitesDetailFormState } from '../../sites.types';

export const BADGES = [
	{
		name: 'site',
		type: 'primary',
	},
];

export const SITE_LANGUAGE_COLUMNS = (
	arrayHelpers: FieldArrayRenderProps,
	values: SitesDetailFormState,
	setShowDeactivateModal: (languageId: {
		showModal: boolean;
		contentOccurrences: number;
		languageId: string;
	}) => void
): TableColumn<LanguageModel & { contentOccurrencesCount: number }>[] => [
	{
		label: 'Naam',
		value: 'name',
		width: '30%',
		disableSorting: true,
		component: (_: string, { key, name }): React.ReactElement => (
			<>
				<p>{name}</p>
				<p className="small">({key})</p>
			</>
		),
	},
	{
		label: 'Aantal content items',
		value: 'contentOccurrencesCount',
		width: '50%',
		component: (value: number): React.ReactElement =>
			value ? <>{value}</> : <small>Geen items.</small>,
		disableSorting: true,
	},
	{
		label: '',
		width: '20%',
		classList: ['u-text-right'],
		component: (_: string, { uuid, contentOccurrencesCount }): React.ReactElement => {
			if (values.languages.includes(uuid)) {
				return (
					<Button
						type="danger"
						outline
						onClick={() =>
							setShowDeactivateModal({
								showModal: true,
								contentOccurrences: contentOccurrencesCount,
								languageId: uuid,
							})
						}
					>
						Deactiveren
					</Button>
				);
			}

			return (
				<Button type="success" outline onClick={() => arrayHelpers.push(uuid)}>
					Activeren
				</Button>
			);
		},
		disableSorting: true,
	},
];
