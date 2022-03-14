import { Table } from '@acpaas-ui/react-editorial-components';
import { LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import React, { FC, useEffect, useState } from 'react';

import { SitesDetailForm } from '../../components';
import languagesConnector from '../../connectors/languages';
import { DETAIL_TAB_MAP } from '../../sites.const';
import { SitesDetailFormState, SitesUpdateRouteProps } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

import { SITE_LANGUAGE_COLUMNS } from './SitesUpdate.const';

const SitesUpdate: FC<SitesUpdateRouteProps> = ({ onCancel, onSubmit, site, siteUI }) => {
	/**
	 * Hooks
	 */
	const isUpdating = !!siteUI?.isUpdating;
	const languageChanging = siteUI?.languageChanging;
	const isActiveLoading = !!siteUI?.isActivating;
	const isArchivedLoading = !!siteUI?.isArchiving;
	const isFetching = !!siteUI?.isFetching;
	const [formValue, setFormValue] = useState<SitesDetailFormState | null>(null);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(
		!isFetching && !!formValue,
		formValue
	);
	const [, languages] = languagesConnector.hooks.useLanguages();

	useEffect(() => {
		languagesConnector.languagesFacade.getLanguages({
			active: true,
		});
	}, []);

	useEffect(() => {
		if (!site) {
			return;
		}

		setFormValue({
			uuid: site.uuid,
			name: site.data.name,
			url: site.data.url,
			contentTypes: site.data.contentTypes,
			languages: site.data.languages,
		});
	}, [site]);

	/**
	 * Methods
	 */

	const onActiveToggle = (): void => {
		if (site) {
			sitesFacade.updateSiteActivation({
				id: site.uuid,
				activate: !site.meta.active,
			});
		}
	};

	const onArchive = (): void => {
		sitesFacade.archiveSite(site.uuid).then(() => onCancel());
	};

	const onLanguageChange = (uuid: string, operator: 'add' | 'remove'): void => {
		sitesFacade
			.updateSiteLanguages(
				{
					id: site.uuid,
					body: {
						...site.data,
						languages:
							operator === 'add'
								? [...site.data.languages, uuid]
								: site.data.languages.filter(languageId => languageId !== uuid),
					},
				},
				uuid
			)
			.then(() => resetChangeDetection());
	};

	/**
	 * Render
	 */
	if (!formValue) {
		return null;
	}

	return (
		<>
			<SitesDetailForm
				active={site?.meta.active}
				initialState={formValue}
				activeLoading={isActiveLoading}
				archiveLoading={isArchivedLoading}
				loading={isUpdating}
				isChanged={hasChanges}
				onCancel={onCancel}
				onSubmit={() => {
					onSubmit(formValue as SitesDetailFormState, DETAIL_TAB_MAP.settings);
					resetChangeDetection();
				}}
				onActiveToggle={onActiveToggle}
				onArchive={onArchive}
				onChange={setFormValue}
			>
				{({ submitForm }) => (
					<>
						<Table
							className="u-margin-top"
							columns={SITE_LANGUAGE_COLUMNS(
								languageChanging,
								onLanguageChange,
								site
							)}
							rows={languages}
						/>
						<LeavePrompt
							confirmText="Bewaren"
							when={hasChanges}
							onConfirm={submitForm}
						/>
					</>
				)}
			</SitesDetailForm>
		</>
	);
};

export default SitesUpdate;
