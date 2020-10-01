import Core from '@redactie/redactie-core';
import ky from 'ky';

import { SearchParams } from './api.service.types';

export type KyInstance = typeof ky;

const CoreConfig = Core.config.getValue('core') || {};

// Create ky instance with defaults
const api: KyInstance = ky.create({
	prefixUrl: '/v1/proxy/admin/sites/v1',
	headers: {
		'x-tenant-id': CoreConfig.tenantId,
	},
	timeout: false,
});

export const parseSearchParams = (searchParams: SearchParams): URLSearchParams => {
	return new URLSearchParams(
		(Object.keys(searchParams) as Array<keyof typeof searchParams>).map(key => {
			return [key, searchParams[key]?.toString() as string];
		})
	);
};

export default api;
