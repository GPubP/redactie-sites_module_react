import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { RolesRightsModuleAPI } from '@redactie/roles-rights-module';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { SiteStatus } from '../../components';
import { RolesRightsConnector } from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { SitesOverviewRowData } from '../../sites.types';

export const SITES_OVERVIEW_COLUMNS = (
	t: TranslateFunc,
	rolesRightsApi: RolesRightsModuleAPI,
	mySecurityrights: string[]
): TableColumn<SitesOverviewRowData>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'name',
		width: '50%',
		component(name: string, { userIsMember, id, description }) {
			return (
				<>
					{userIsMember ? (
						<AUILink to={`${id}/content`} component={Link}>
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
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		width: '20%',
		component(value, { navigateToEdit }) {
			return (
				<rolesRightsApi.components.SecurableRender
					userSecurityRights={mySecurityrights as string[]}
					requiredSecurityRights={[RolesRightsConnector.securityRights.update]}
				>
					<Button
						ariaLabel="Edit"
						icon="edit"
						onClick={navigateToEdit}
						type="primary"
						transparent
					/>
				</rolesRightsApi.components.SecurableRender>
			);
		},
	},
];
