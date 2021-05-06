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
	useDetectValueChanges,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import { FormikProps } from 'formik';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SitesDetailForm } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useHomeBreadcrumb, useSite } from '../../hooks';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	DETAIL_TABS,
	MODULE_PATHS,
} from '../../sites.const';
import { SitesDetailFormState, SitesRouteProps } from '../../sites.types';
import { sitesFacade } from '../../store/sites';

import { BADGES } from './SitesUpdate.const';

const SitesCreate: FC<SitesRouteProps> = () => {
	const { siteId } = useParams<{ siteId: string }>();

	/**
	 * Hooks
	 */
	const [site, siteUI] = useSite(siteId);
	const [t] = useCoreTranslation();
	const isFetching = !!siteUI?.isFetching;
	const isUpdating = !!siteUI?.isUpdating;
	const isActiveLoading = !!siteUI?.isActivating;
	const isArchivedLoading = !!siteUI?.isArchiving;
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
	const { generatePath, navigate } = useNavigate();
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

	const pageTitle = `'${site?.data?.name ? `'${site?.data?.name}'` : 'Site'}' ${t(
		CORE_TRANSLATIONS.ROUTING_UPDATE
	)}`;

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
			<ContextHeader
				linkProps={(props: any) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.root}${MODULE_PATHS.detailEdit}`, { siteId }),
					component: Link,
				})}
				tabs={DETAIL_TABS}
				title={pageTitle}
				badges={BADGES}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.update}
				/>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.fetchOne}
				/>
				<DataLoader loadingState={isFetching} render={renderSitesUpdate} />
			</Container>
		</>
	);
};

export default SitesCreate;
