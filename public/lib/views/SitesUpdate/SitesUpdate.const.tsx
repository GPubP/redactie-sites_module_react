/* eslint-disable react/display-name */
import { Button } from '@acpaas-ui/react-components';
import { LanguageModel } from '@redactie/language-module';
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
	site: SiteResponse,
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
		component: (_: string, { key, contentOccurrencesCount }): React.ReactElement => {
			if ((site.data.languages as string[]).includes(key)) {
				return (
					<Button
						type="danger"
						outline
						iconLeft={languageChanging === key ? 'circle-o-notch fa-spin' : null}
						onClick={() =>
							setShowDeactivateModal({
								showModal: true,
								contentOccurrences: contentOccurrencesCount,
								languageId: key,
							})
						}
					>
						Deactiveren
					</Button>
				);
			}

			return (
				<Button
					type="success"
					outline
					onClick={() => onLanguageChange(key, 'add')}
					iconLeft={languageChanging === key ? 'circle-o-notch fa-spin' : null}
				>
					Activeren
				</Button>
			);
		},
		disableSorting: true,
	},
];
