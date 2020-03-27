import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import {
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { prop } from 'ramda';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { DataLoader, Status } from '../../components';
import { useRoutes, useSites } from '../../hooks';
import {
	BREADCRUMB_OPTIONS,
	DEFAULT_SITES_SEARCH_PARAMS,
	DEFAULT_SITES_SORTING,
} from '../../sites.const';
import { parseOrderBy } from '../../sites.helpers';
import { SitesRouteProps } from '../../sites.types';
import { LoadingState, OrderBy } from '../../types';

const Dashboard: FC<SitesRouteProps> = ({ basePath }) => {
	/**
	 * Hooks
	 */
	const [currentPage, setCurrentPage] = useState(DEFAULT_SITES_SEARCH_PARAMS.page);
	const [sitesSearchParams, setSitesSearchParams] = useState(DEFAULT_SITES_SEARCH_PARAMS);
	const [sitesActiveSorting, setSitesActiveSorting] = useState(DEFAULT_SITES_SORTING);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const history = useHistory();
	const [loadingState, sites] = useSites(sitesSearchParams);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	useEffect(() => {
		if (loadingState === LoadingState.Loaded || loadingState === LoadingState.Error) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	/**
	 * Functions
	 */
	const handlePageChange = (pageNumber: number): void => {
		setCurrentPage(pageNumber);

		setSitesSearchParams({
			...sitesSearchParams,
			page: pageNumber,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setSitesActiveSorting(orderBy);

		setSitesSearchParams({
			...sitesSearchParams,
			sort: parseOrderBy(orderBy),
		});
	};

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!sites) {
			return null;
		}

		const sitesRows = sites.data.map(site => ({
			id: site.uuid,
			name: site.data.name,
			description: site.data.description,
		}));

		const sitesColumns = [
			{
				label: 'Naam',
				value: 'name',
				component(value: any, rowData: any) {
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
				value: 'status',
				component() {
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
				<PaginatedTable
					className="u-margin-top"
					columns={sitesColumns}
					rows={sitesRows}
					currentPage={currentPage}
					itemsPerPage={DEFAULT_SITES_SEARCH_PARAMS.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={sitesActiveSorting}
					totalValues={sites.meta.totalElements}
					loading={loadingState === LoadingState.Loading}
				></PaginatedTable>
			</div>
		);
	};

	return (
		<>
			<ContextHeader title="Dashboard">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => history.push(`${basePath}/aanmaken`)}>
						Nieuwe maken
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<DataLoader loadingState={initialLoading} render={renderOverview} />
		</>
	);
};

export default Dashboard;
