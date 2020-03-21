import { Breadcrumbs, Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	Table,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { getSites } from '../../sites.service';
import { SiteSchema } from '../../sites.types';
import { LoadingState } from '../../types';

const BREADCRUMB_ITEMS = [
	{
		name: 'Home',
		target: '/',
	},
];

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
				classList: ['u-text-right'],
				disableSorting: true,
				component: (value: any, rowData: any) => {
					const { id } = rowData;

					return (
						<Button icon="edit" ariaLabel="Edit" type="primary" size="tiny"></Button>
					);
				},
			},
		];

		return (
			<div className="u-container">
				<h5 className="u-margin-top">Resultaat ({sitesRows.length})</h5>
				<Table className="u-margin-top" rows={sitesRows} columns={sitesColumns} />
			</div>
		);
	};

	return (
		<>
			<ContextHeader title="Sites">
				<ContextHeaderTopSection>
					<Breadcrumbs items={BREADCRUMB_ITEMS} />
				</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus">Nieuwe maken</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<DataLoader loadingState={loadingState} render={renderOverview} />
		</>
	);
};

export default SitesOverview;
