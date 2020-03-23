import { ContextHeader } from '@acpaas-ui/react-editorial-components';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { DataLoader, SitesDetailForm } from '../../components';
import { getSiteById, updateSite } from '../../sites.service';
import { SiteSchema, SitesDetailFormState, SitesRouteProps } from '../../sites.types';
import { LoadingState, Tab } from '../../types';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];

const SitesCreate: FC<SitesRouteProps> = ({ basePath }) => {
	const { siteId } = useParams();

	/**
	 * Hooks
	 */
	const [formState, setFormState] = useState<SitesDetailFormState | null>(null);
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);

	const history = useHistory();

	const navigateToOverview = useCallback(() => {
		history.push(`${basePath}/beheer`);
	}, [basePath, history]);

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			if (!siteId) {
				navigateToOverview();
			}

			const response = await getSiteById(siteId as string);

			if (!response) {
				navigateToOverview();
			}

			setLoadingState(LoadingState.Loaded);
			setFormState({
				name: (response as SiteSchema).data.name,
			});
		};

		fetchData();
	}, [navigateToOverview, siteId]);

	/**
	 * Methods
	 */

	const onSubmit = ({ name }: SitesDetailFormState): void => {
		const request = { name, description: name };

		const response = updateSite(siteId as string, request);

		if (response) {
			// Create was succesful, go back to the overview
			navigateToOverview();
		}
	};

	const onActiveToggle = (): void => {
		// Todo: handle onActiveTogle
	};

	/**
	 * Render
	 */
	const renderSitesUpdate = (): ReactElement | null => {
		if (!formState) {
			return null;
		}

		return (
			<div className="u-margin-top u-container u-wrapper">
				<SitesDetailForm
					initialState={formState}
					onCancel={navigateToOverview}
					onSubmit={onSubmit}
					onActiveToggle={onActiveToggle}
				/>
			</div>
		);
	};

	return (
		<>
			<ContextHeader tabs={TABS} title="Site bewerken" />
			<DataLoader loadingState={loadingState} render={renderSitesUpdate} />
		</>
	);
};

export default SitesCreate;
