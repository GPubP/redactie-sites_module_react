import { Link as AUILink } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { SiteStatus } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { SitesOverviewRowData } from '../../sites.types';

export const DASHBOARD_COLUMNS = (t: TranslateFunc): TableColumn<SitesOverviewRowData>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'name',
		width: '70%',
		component(name: string, { userIsMember, id, description }) {
			return (
				<>
					{userIsMember ? (
						<AUILink to={`sites/${id}/content`} component={Link}>
							<EllipsisWithTooltip>{name}</EllipsisWithTooltip>
						</AUILink>
					) : (
						<label>
							<EllipsisWithTooltip>{name}</EllipsisWithTooltip>
						</label>
					)}
					<p className="small">
						{description ? (
							<EllipsisWithTooltip>{description}</EllipsisWithTooltip>
						) : (
							<span className="u-text-italic">
								{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
							</span>
						)}
					</p>
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'active',
		width: '30%',
		component(value: string) {
			const isActive = !!value;
			return <SiteStatus active={isActive} />;
		},
	},
];
