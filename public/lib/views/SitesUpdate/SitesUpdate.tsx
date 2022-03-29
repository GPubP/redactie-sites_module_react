import { Table } from '@acpaas-ui/react-editorial-components';
import { DeletePrompt, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { FieldArray } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { SitesDetailForm } from '../../components';
import languagesConnector from '../../connectors/languages';
import { DETAIL_TAB_MAP } from '../../sites.const';
import { SitesDetailFormState, SitesUpdateRouteProps } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

import { SITE_LANGUAGE_COLUMNS } from './SitesUpdate.const';

const SitesUpdate: FC<SitesUpdateRouteProps> = ({ onCancel, onSubmit, site, siteUI }) => {
	const { siteId } = useParams<{ siteId: string }>();
	/**
	 * Hooks
	 */
	const isUpdating = !!siteUI?.isUpdating;
	const isActiveLoading = !!siteUI?.isActivating;
	const isArchivedLoading = !!siteUI?.isArchiving;
	const isFetching = !!siteUI?.isFetching;
	const [formValue, setFormValue] = useState<SitesDetailFormState | null>(null);
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
				{({ submitForm, values }) => (
					<>
						<FieldArray
							name="languages"
							render={arrayHelpers => (
								<>
									<Table
										className="u-margin-top"
										columns={SITE_LANGUAGE_COLUMNS(
											arrayHelpers,
											values,
											setDeactivateModalInfo
										)}
										rows={languages}
									/>

									<DeletePrompt
										body={
											deactivateModalInfo?.contentOccurrences ? (
												<>
													Er zijn binnen deze site{' '}
													<b>{deactivateModalInfo?.contentOccurrences}</b>{' '}
													content items die deze taal gebruiken. Als je
													deze taal deactiveert zijn deze niet meer
													beschikbaar in de redactie én de frontend.
													Heractiveren van de taal zal de content items
													opnieuw beschikbaar maken.
												</>
											) : (
												<>
													Er zijn binnen deze site geen content items die
													deze taal gebruiken. Als je deze taal
													deactiveert wordt deze niet meer aangeboden aan
													de redacteurs.
												</>
											)
										}
										title="Bevestigen"
										show={!!deactivateModalInfo?.showModal}
										onCancel={() =>
											setDeactivateModalInfo({ showModal: false })
										}
										confirmButtonIcon="check"
										confirmButtonType="success"
										onConfirm={() => {
											if (!deactivateModalInfo?.languageId) {
												return;
											}

											const idx = values?.languages?.indexOf(
												deactivateModalInfo.languageId
											);
											arrayHelpers.remove(Number(idx));
											setDeactivateModalInfo({ showModal: false });
										}}
										confirmText="Ja, ok"
									/>
								</>
							)}
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
