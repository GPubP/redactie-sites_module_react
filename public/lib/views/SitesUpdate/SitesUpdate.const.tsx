/* eslint-disable react/display-name */
import { Button } from '@acpaas-ui/react-components';
import { TableColumn } from '@redactie/utils';
import React from 'react';

import { SiteResponse } from '../../services/sites';

export const BADGES = [
	{
		name: 'site',
		type: 'primary',
	},
];

export const SITE_LANGUAGE_COLUMNS = (
	languageChanging: string | undefined,
	onLanguageChange: Function,
	site: SiteResponse
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
			if (site.data.languages.includes(uuid)) {
				return (
					<Button
						type="danger"
						outline
						onClick={() => onLanguageChange(uuid, 'remove')}
						iconLeft={languageChanging === uuid ? 'circle-o-notch fa-spin' : null}
					>
						Deactiveren
					</Button>
				);
			}

			return (
				<Button
					type="success"
					outline
					onClick={() => onLanguageChange(uuid, 'add')}
					iconLeft={languageChanging === uuid ? 'circle-o-notch fa-spin' : null}
				>
					Activeren
				</Button>
			);
		},
		disableSorting: true,
	},
];
