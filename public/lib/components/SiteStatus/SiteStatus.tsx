import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import React, { FC } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import Status from '../Status/Status';

import { SitesStatusProps } from './SiteStatus.types';

const SitesStatus: FC<SitesStatusProps> = ({ active = false }) => {
	const [t] = useCoreTranslation();

	return (
		<>
			{active ? (
				<Status label={t(CORE_TRANSLATIONS.STATUS_ACTIVE)} type="ACTIVE" />
			) : (
				<Status label={t(CORE_TRANSLATIONS['STATUS_NON-ACTIVE'])} type="INACTIVE" />
			)}
		</>
	);
};

export default SitesStatus;
