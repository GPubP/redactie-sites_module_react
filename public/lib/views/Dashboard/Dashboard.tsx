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
import { useAPIQueryParams } from '@redactie/utils';
import { prop } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataLoader, SiteStatus } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { useNavigate, useRoutes, useSitesLoadingStates, useSitesPagination } from '../../hooks';
import { OrderBy, SearchParams } from '../../services/api';
import { parseOrderBy, parseOrderByString } from '../../services/helpers';
import { BREADCRUMB_OPTIONS, DEFAULT_SITES_SORTING, MODULE_PATHS } from '../../sites.const';
import { LoadingState, SitesRouteProps } from '../../sites.types';
import { SitesOverviewRowData } from '../SitesOverview/SitesOverview.types';

const Dashboard: FC<SitesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const { navigate } = useNavigate();
	const routes = useRoutes();
	const [query, setQuery] = useAPIQueryParams({
		...DEFAULT_SITES_SORTING,
	});
	const sitesActiveSorting = useMemo(() => parseOrderByString(query.sort), [query.sort]);
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const sitesPagination = useSitesPagination(query as SearchParams);
	const sitesLoadingStates = useSitesLoadingStates();
	const [t] = useCoreTranslation();

	useEffect(() => {
		if (
			sitesLoadingStates.isFetching === LoadingState.Loaded ||
			sitesLoadingStates.isFetching === LoadingState.Error
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [sitesLoadingStates.isFetching]);

	/**
	 * Functions
	 */
	const handlePageChange = (pageNumber: number): void => {
		setQuery({
			page: pageNumber,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setQuery({
			...query,
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
		if (!sitesPagination) {
			return null;
		}

		const sitesRows: SitesOverviewRowData[] = sitesPagination?.data.map(site => ({
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
				currentPage={sitesPagination.currentPage}
				itemsPerPage={query.pagesize}
				onPageChange={handlePageChange}
				orderBy={handleOrderBy}
				activeSorting={sitesActiveSorting}
				totalValues={sitesPagination.total}
				loading={sitesLoadingStates.isFetching === LoadingState.Loading}
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
