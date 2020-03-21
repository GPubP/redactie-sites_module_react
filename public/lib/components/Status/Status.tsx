import React, { FC } from 'react';

import { typeMap } from './Status.config';
import { StatusProps } from './Status.types';

const Status: FC<StatusProps> = ({ label = '', type = 'ACTIVE' }) => {
	return <span className={`u-text-${typeMap[type]}`}>{label}</span>;
};

export default Status;
