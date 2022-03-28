/* eslint-disable react/display-name */
import { Button } from '@acpaas-ui/react-components';
import { TableColumn } from '@redactie/utils';
import { FieldArrayRenderProps } from 'formik';
import React from 'react';

import { SiteResponse } from '../../services/sites';
import { SitesDetailFormState } from '../../sites.types';

export const BADGES = [
	{
		name: 'site',
		type: 'primary',
	},
];

export const SITE_LANGUAGE_COLUMNS = (
	arrayHelpers: FieldArrayRenderProps,
	values: SitesDetailFormState
): TableColumn<SiteResponse>[] => [
	{
		label: 'Naam',
		value: 'name',
		width: '30%',
		disableSorting: true,
	},
	{
		label: 'Aantal content items',
		width: '50%',
		component: (): React.ReactElement => <small>Geen items.</small>,
		disableSorting: true,
	},
	{
		label: '',
		width: '20%',
		classList: ['u-text-right'],
		component: (_: string, { uuid }): React.ReactElement => {
			if (values.languages.includes(uuid)) {
				return (
					<Button
						type="danger"
						outline
						onClick={() => {
							const idx = values?.languages?.indexOf(uuid);
							arrayHelpers.remove(Number(idx));
						}}
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
