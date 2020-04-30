import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { DataLoader } from '../../components';
import { useCoreTranslation } from '../../connectors/translations';
import { useRoutes, useSites } from '../../hooks';
import { OrderBy } from '../../services/api';
import { parseOrderBy } from '../../services/helpers';
import { DEFAULT_SITES_SEARCH_PARAMS } from '../../services/sites';
import { BREADCRUMB_OPTIONS, DEFAULT_SITES_SORTING } from '../../sites.const';
import { LoadingState, SitesRouteProps } from '../../sites.types';
import { sitesService } from '../../store/sites';

import { SitesOverviewRowData } from './SitesOverview.types';

const SitesOverview: FC<SitesRouteProps> = ({ basePath, history }) => {
	/**
	 * Hooks
	 */
	const [currentPage, setCurrentPage] = useState(DEFAULT_SITES_SEARCH_PARAMS.page);
	const [sitesSearchParams, setSitesSearchParams] = useState(DEFAULT_SITES_SEARCH_PARAMS);
	const [sitesActiveSorting, setSitesActiveSorting] = useState(DEFAULT_SITES_SORTING);
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
			},
			{
				label: t(CORE_TRANSLATIONS.TABLE_DESCRIPTION),
				value: 'description',
			},
			{
				label: '',
				classList: ['u-text-right'],
				disableSorting: true,
				component(value: unknown, rowData: unknown) {
					const { id } = rowData as SitesOverviewRowData;

					return (
						<Button
							ariaLabel="Edit"
							icon="edit"
							onClick={() => history.push(`${basePath}/${id}/bewerken`)}
							type="primary"
							transparent
						></Button>
					);
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
			<ContextHeader title="Sites">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => history.push(`${basePath}/aanmaken`)}>
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

export default SitesOverview;
