import Button from '@acpaas-ui/react-components/packages/button';
import { Table } from '@acpaas-ui/react-editorial-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { getSites } from '../../sites.service';
import { SiteSchema } from '../../sites.types';
import { LoadingState } from '../../types';

const SitesOverview: FC = () => {
	/**
	 * Hooks
	 */
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
	const [sites, setSites] = useState<SiteSchema[] | null>(null);

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
				value: 'name',
			},
			{
				label: 'Omschrijving',
				value: 'description',
			},
			{
				label: '',
				component: (value: any, rowData: any) => {
					const { id } = rowData;

					return (
						<Button icon="edit" ariaLabel="Edit" type="primary" size="tiny"></Button>
					);
				},
			},
		];

		return (
			<>
				<h4>Resultaat ({sitesRows.length})</h4>
				<Table rows={sitesRows} columns={sitesColumns} />
			</>
		);
	};

	return (
		<>
			<div>
				<p>breadcrumbs</p>
				<p>Header</p>
			</div>
			<p>Filter</p>
			<DataLoader loadingState={loadingState} render={renderOverview} />
		</>
	);
};

export default SitesOverview;
