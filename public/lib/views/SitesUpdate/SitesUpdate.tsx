import { LeavePrompt, useDetectValueChanges, useNavigate } from '@redactie/utils';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { SitesDetailForm } from '../../components';
import { DETAIL_TAB_MAP, MODULE_PATHS } from '../../sites.const';
import { SitesDetailFormState, SitesUpdateRouteProps } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

const SitesUpdate: FC<SitesUpdateRouteProps> = ({ onCancel, onSubmit, site, siteUI }) => {
	/**
	 * Hooks
	 */
	const isUpdating = !!siteUI?.isUpdating;
	const isActiveLoading = !!siteUI?.isActivating;
	const isArchivedLoading = !!siteUI?.isArchiving;
	const isFetching = !!siteUI?.isFetching;
	const [formValue, setFormValue] = useState<SitesDetailFormState | null>(null);
	const { navigate } = useNavigate();
	const navigateToOverview = useCallback(
		() => navigate(`${MODULE_PATHS.root}${MODULE_PATHS.overview}`),
		[navigate]
	);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(
		!isFetching && !!formValue,
		formValue
	);

	useEffect(() => {
		if (site) {
			setFormValue({
				uuid: site.uuid,
				name: site.data.name,
				url: site.data.url,
				contentTypes: site.data.contentTypes,
			});
		}
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
		sitesFacade.archiveSite(site.uuid).then(() => navigateToOverview());
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
					<LeavePrompt confirmText="Bewaar" when={hasChanges} onConfirm={submitForm} />
				)}
			</SitesDetailForm>
		</>
	);
};

export default SitesUpdate;
