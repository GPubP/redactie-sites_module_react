import React, { FC } from 'react';

import Status from '../Status/Status';

import { SitesStatusProps } from './SiteStatus.types';

const SitesStatus: FC<SitesStatusProps> = ({ active = false }) => {
	return (
		<>
			{active ? (
				<Status label="Actief" type="ACTIVE" />
			) : (
				<Status label="Niet actief" type="INACTIVE" />
			)}
		</>
	);
};

export default SitesStatus;
