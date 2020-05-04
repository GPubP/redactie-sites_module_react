import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { prop } from 'ramda';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader, SiteStatus } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { useNavigate, useRoutes, useSites } from '../../hooks';
import { OrderBy } from '../../services/api';
import { parseOrderBy } from '../../services/helpers';
import { DEFAULT_SITES_SEARCH_PARAMS } from '../../services/sites';
import { BREADCRUMB_OPTIONS, DEFAULT_SITES_SORTING, MODULE_PATHS } from '../../sites.const';
import { LoadingState, SitesRouteProps } from '../../sites.types';
import { sitesService } from '../../store/sites';
import { SitesOverviewRowData } from '../SitesOverview/SitesOverview.types';

const Dashboard: FC<SitesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const [currentPage, setCurrentPage] = useState(DEFAULT_SITES_SEARCH_PARAMS.page);
	const [sitesSearchParams, setSitesSearchParams] = useState(DEFAULT_SITES_SEARCH_PARAMS);
	const [sitesActiveSorting, setSitesActiveSorting] = useState(DEFAULT_SITES_SORTING);
	const { navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [loadingState, sites, sitesMeta] = useSites();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [t] = useCoreTranslation();

	useEffect(() => {
		sitesService.getSites(sitesSearchParams);
	}, [sitesSearchParams]);

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
			sort: parseOrderBy({
				...orderBy,
				key: `data.${orderBy.key}`,
			}),
		});
	};

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!sites) {
			return null;
		}

		const sitesRows: SitesOverviewRowData[] = sites.map(site => ({
			id: site.uuid,
			name: site.data.name,
			status: site.meta.active,
			description: site.data.description,
		}));

		const sitesColumns = [
			{
				label: t(CORE_TRANSLATIONS.TABLE_NAME),
				value: 'name',
				component(value: any, rowData: SitesOverviewRowData) {
					return (
						<>
							<AUILink to={`sites/${prop('id')(rowData)}/content`} component={Link}>
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
				label: t(CORE_TRANSLATIONS.TABLE_STATUS),
				value: 'status',
				component(value: string, rowData: SitesOverviewRowData) {
					const isActive = !!rowData['status'];
					return <SiteStatus active={isActive} />;
				},
			},
		];

		return (
			<PaginatedTable
				columns={sitesColumns}
				rows={sitesRows}
				currentPage={currentPage}
				itemsPerPage={DEFAULT_SITES_SEARCH_PARAMS.pagesize}
				onPageChange={handlePageChange}
				orderBy={handleOrderBy}
				activeSorting={sitesActiveSorting}
				totalValues={sitesMeta?.totalElements}
				loading={loadingState === LoadingState.Loading}
			></PaginatedTable>
		);
	};

	return (
		<>
			<ContextHeader title="Dashboard">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button
						iconLeft="plus"
						onClick={() => navigate(`${MODULE_PATHS.root}${MODULE_PATHS.create}`)}
					>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default Dashboard;
