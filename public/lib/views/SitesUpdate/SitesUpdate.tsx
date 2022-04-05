import { LanguageHeader, Table } from '@acpaas-ui/react-editorial-components';
import { LanguageSchema } from '@redactie/language-module';
import {
	DeletePrompt,
	ErrorMessage,
	Language,
	LeavePrompt,
	useDetectValueChanges,
} from '@redactie/utils';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ArchiveSite, SitesDetailForm } from '../../components';
import languagesConnector from '../../connectors/languages';
import { DETAIL_TAB_MAP } from '../../sites.const';
import { SitesDetailFormState, SitesUpdateRouteProps } from '../../sites.types';
import { SITES_ALERT_CONTAINER_IDS, sitesFacade } from '../../store/sites';

import { SITE_LANGUAGE_COLUMNS } from './SitesUpdate.const';

const SitesUpdate: FC<SitesUpdateRouteProps> = ({ onCancel, onSubmit, site, siteUI }) => {
	const { siteId } = useParams<{ siteId: string }>();

	/**
	 * Hooks
	 */
	const isUpdating = !!siteUI?.isUpdating;
	const languageChanging = siteUI?.languageChanging;
	const isActiveLoading = !!siteUI?.isActivating;
	const isArchivedLoading = !!siteUI?.isArchiving;
	const isFetching = !!siteUI?.isFetching;
	const [formValue, setFormValue] = useState<SitesDetailFormState | null>(null);
	const [activeLanguage, setActiveLanguage] = useState<Language | LanguageSchema>();
	const [deactivateModalInfo, setDeactivateModalInfo] = useState<{
		showModal: boolean;
		contentOccurrences?: number;
		languageId?: string;
	}>();
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(
		!isFetching && !!formValue,
		formValue
	);
	const [, , , languages] = languagesConnector.hooks.useLanguages();
	const [loadingState, activeLanguages] = languagesConnector.hooks.useActiveLanguagesForSite(
		siteId
	);

	useEffect(() => {
		languagesConnector.languagesFacade.getLanguages({
			active: true,
			includeContentOccurrences: true,
			site: siteId,
			sort: 'name',
		});
	}, [siteId]);

	useEffect(() => {
		if (!site) {
			return;
		}

		setFormValue({
			uuid: site.uuid,
			name: site.data.name,
			url: site.data.url,
			contentTypes: site.data.contentTypes,
			languages: site.data.languages as string[],
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
		const language = languages?.find(lang => lang.uuid === uuid);
		sitesFacade
			.updateSiteLanguages(
				{
					id: site.uuid,
					body: {
						...site.data,
						languages:
							operator === 'add'
								? [...(site.data.languages as string[]), uuid]
								: (site.data.languages as string[]).filter(
										languageId => languageId !== uuid
								  ),
					},
				},
				uuid,
				{
					alertContainerId: SITES_ALERT_CONTAINER_IDS.update,
					alertType: operator === 'add' ? 'activateLanguage' : 'deactivateLanguage',
					alertName: `${language?.name} (${language?.key})`,
				}
			)
			.then(() => {
				resetChangeDetection();

				languagesConnector.languagesFacade.getActiveLanguages({
					pagesize: '-1',
					includeSiteOccurrences: true,
					sort: 'name',
				});
			});
	};

	useEffect(() => {
		if (Array.isArray(activeLanguages) && !activeLanguage) {
			setActiveLanguage(activeLanguages[0]);
		}
	}, [activeLanguage, activeLanguages]);

	/**
	 * Render
	 */
	if (!formValue) {
		return null;
	}

	return (
		<>
			<LanguageHeader
				languages={activeLanguages}
				activeLanguage={activeLanguage}
				onChangeLanguage={(language: string) => setActiveLanguage({ key: language })}
			>
				<SitesDetailForm
					active={site?.meta.active}
					initialState={formValue}
					activeLanguage={activeLanguage}
					activeLoading={isActiveLoading}
					archiveLoading={isArchivedLoading}
					loading={isUpdating}
					isChanged={hasChanges}
					activeLanguages={activeLanguages}
					loadingState={loadingState}
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
									site,
									setDeactivateModalInfo
								)}
								rows={languages}
							/>
							<ErrorMessage name="languages" />
							<ArchiveSite
								initialState={formValue}
								active={site?.meta.active}
								activeLoading={isActiveLoading}
								archiveLoading={isArchivedLoading}
								onArchive={onArchive}
							/>
							<DeletePrompt
								body={
									deactivateModalInfo?.contentOccurrences ? (
										<>
											Er zijn binnen deze site{' '}
											<b>{deactivateModalInfo?.contentOccurrences}</b> content
											items die deze taal gebruiken. Als je deze taal
											deactiveert zijn deze niet meer beschikbaar in de
											redactie én de frontend. Heractiveren van de taal zal de
											content items opnieuw beschikbaar maken.
										</>
									) : (
										<>
											Er zijn binnen deze site geen content items die deze
											taal gebruiken. Als je deze taal deactiveert wordt deze
											niet meer aangeboden aan de redacteurs.
										</>
									)
								}
								title="Bevestigen"
								show={!!deactivateModalInfo?.showModal}
								onCancel={() => setDeactivateModalInfo({ showModal: false })}
								confirmButtonIcon="check"
								confirmButtonType="success"
								onConfirm={() => {
									if (!deactivateModalInfo?.languageId) {
										return;
									}

									onLanguageChange(deactivateModalInfo.languageId, 'remove');
									setDeactivateModalInfo({ showModal: false });
								}}
								confirmText="Ja, ok"
							/>
							<LeavePrompt
								confirmText="Bewaren"
								when={hasChanges}
								onConfirm={submitForm}
							/>
						</>
					)}
				</SitesDetailForm>
			</LanguageHeader>
		</>
	);
};

export default SitesUpdate;
