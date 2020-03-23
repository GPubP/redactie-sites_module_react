import { Link as AUILink, Breadcrumbs, Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import { prop } from 'ramda';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { DataLoader, Status } from '../../components';
import { getSites } from '../../sites.service';
import { SiteSchema, SitesRouteProps } from '../../sites.types';
import { LoadingState } from '../../types';

const BREADCRUMB_ITEMS = [
	{
		name: 'Dashboard',
		target: '/',
	},
];

const Dashboard: FC<SitesRouteProps> = ({ basePath }) => {
	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [sites, setSites] = useState<SiteSchema[] | null>(null);

	const history = useHistory();

	useEffect(() => {
		getSites()
			.then(data => {
				if (data?.length) {
					setSites(data);
				}
				setLoadingState(LoadingState.Loaded);
			})
			.catch(() => {
				setLoadingState(LoadingState.Error);
			});
	}, []);

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!sites) {
			return null;
		}

		const sitesRows = sites.map(site => ({
			id: site.uuid,
			name: site.data.name,
			description: site.data.description,
		}));

		const sitesColumns = [
			{
				label: 'Naam',
				component: (value: any, rowData: any) => {
					return (
						<>
							<AUILink to={`sites/${prop('id')(rowData)}`} component={Link}>
								{prop('name')(rowData)}
							</AUILink>
							<p className="u-text-light u-margin-top-xs">
								{prop('description')(rowData)}
							</p>
						</>
					);
				},
			},
			{
				label: 'Status',
				component: (value: any, rowData: any) => {
					return <Status label="Actief" type="ACTIVE" />;
				},
			},
			{
				label: '',
				disableSorting: true,
				component: () => '',
			},
		];

		return (
			<div className="u-container u-wrapper">
				<h5 className="u-margin-top">Sites ({sitesRows.length})</h5>
				<Table className="u-margin-top" rows={sitesRows} columns={sitesColumns} />
			</div>
		);
	};

	return (
		<>
			<ContextHeader title="Dashboard">
				<ContextHeaderTopSection>
					<Breadcrumbs items={BREADCRUMB_ITEMS} />
				</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => history.push(`${basePath}/aanmaken`)}>
						Nieuwe maken
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<DataLoader loadingState={loadingState} render={renderOverview} />
		</>
	);
};

export default Dashboard;
