import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	DataLoader,
	LeavePrompt,
	LoadingState,
	useDetectValueChanges,
	useNavigate,
	useRoutes,
	useWillUnmount,
} from '@redactie/utils';
import { FormikProps } from 'formik';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { SitesDetailForm } from '../../components';
import { useHomeBreadcrumb, useSite, useSitesLoadingStates } from '../../hooks';
import { ALERT_CONTAINER_IDS, BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../sites.const';
import { SitesDetailFormState, SitesRouteProps } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

import { TABS } from './SitesUpdate.const';

const SitesCreate: FC<SitesRouteProps> = () => {
	const { siteId } = useParams<{ siteId: string }>();

	/**
	 * Hooks
	 */
	const [loadingState, site] = useSite();
	const sitesLoadingStates = useSitesLoadingStates();
	const isFetching = loadingState === LoadingState.Loading;
	const isUpdating = sitesLoadingStates.isUpdating === LoadingState.Loading;
	const isActiveLoading = sitesLoadingStates.isActivating === LoadingState.Loading;
	const isArchivedLoading = sitesLoadingStates.isArchiving === LoadingState.Loading;
	const [initialFormValue, setInitialFormValue] = useState<SitesDetailFormState | null>(null);
	const [formValue, setFormValue] = useState<SitesDetailFormState | null>(initialFormValue);
	const [isChanged, resetDetectValueChanges] = useDetectValueChanges(
		!isFetching && !isUpdating,
		formValue || initialFormValue
	);

	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		extraBreadcrumbs: [useHomeBreadcrumb()],
	});
	const { navigate } = useNavigate();
	const navigateToOverview = useCallback(
		() => navigate(`${MODULE_PATHS.root}${MODULE_PATHS.overview}`),
		[navigate]
	);

	useEffect(() => {
		if (site) {
			setInitialFormValue({
				uuid: site.uuid,
				name: site.data.name,
				url: site.data.url,
				contentTypes: site.data.contentTypes,
			});
		}
	}, [site]);

	useEffect(() => {
		if (siteId) {
			sitesFacade.getSite({ id: siteId });
			return;
		}
	}, [siteId]);

	useWillUnmount(() => {
		sitesFacade.resetSite();
	});

	/**
	 * Methods
	 */
	const onSubmit = ({ name, contentTypes, url }: SitesDetailFormState): void => {
		const request = { name, description: name, contentTypes, url };

		if (!siteId) {
			return;
		}

		sitesFacade
			.updateSite({
				id: siteId,
				body: request,
			})
			.then(() => resetDetectValueChanges());
	};

	const onCancel = (resetForm: FormikProps<SitesDetailFormState>['resetForm']): void => {
		resetForm();
		resetDetectValueChanges();
	};

	const onActiveToggle = (): void => {
		if (siteId && site) {
			sitesFacade.updateSiteActivation({
				id: siteId,
				activate: !site.meta.active,
			});
		}
	};

	const onArchive = (): void => {
		sitesFacade.archiveSite(siteId).then(() => navigateToOverview());
	};

	/**
	 * Render
	 */
	const renderSitesUpdate = (): ReactElement | null => {
		if (!initialFormValue) {
			return null;
		}

		return (
			<SitesDetailForm
				active={site?.meta.active}
				initialState={initialFormValue}
				activeLoading={isActiveLoading}
				archiveLoading={isArchivedLoading}
				loading={isUpdating}
				isChanged={isChanged}
				onCancel={onCancel}
				onSubmit={onSubmit}
				onActiveToggle={onActiveToggle}
				onArchive={onArchive}
				onChange={setFormValue}
			>
				{({ submitForm }) => (
					<LeavePrompt
						shouldBlockNavigationOnConfirm
						confirmText="Bewaar"
						when={isChanged}
						onConfirm={submitForm}
					/>
				)}
			</SitesDetailForm>
		);
	};

	return (
		<>
			<ContextHeader tabs={TABS} title={`${site?.data.name || ''} bewerken`}>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<div className="u-margin-bottom">
					<AlertContainer containerId={ALERT_CONTAINER_IDS.update} />
				</div>
				<DataLoader loadingState={loadingState} render={renderSitesUpdate} />
			</Container>
		</>
	);
};

export default SitesCreate;
