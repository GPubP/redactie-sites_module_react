import apiService, { parseSearchParams } from './services/api-service';
import { DEFAULT_SITES_SEARCH_PARAMS } from './sites.const';
import { SiteSchema, SitesDataSchema, SitesDetailRequestBody, SitesSchema } from './sites.types';
import { SearchParams } from './types';

export const getSites = async (
	searchParams: SearchParams = DEFAULT_SITES_SEARCH_PARAMS
): Promise<SitesDataSchema | null> => {
	try {
		const response: SitesSchema = await apiService
			.get('sites', {
				searchParams: parseSearchParams(searchParams),
			})
			.json();

		if (!response._embedded) {
			throw new Error('Failed to get sites');
		}

		return {
			meta: response._page,
			data: response._embedded,
		};
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const createSite = async (body: SitesDetailRequestBody): Promise<any | null> => {
	try {
		const response: SiteSchema = await apiService.post('sites', { json: body }).json();

		if (!response.data) {
			throw new Error('Failed to create site');
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const getSiteById = async (id: string): Promise<SiteSchema | null> => {
	try {
		const response: SiteSchema = await apiService.get(`sites/${id}`).json();

		if (!response.data) {
			throw new Error(`Failed to get site with id: ${id}`);
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const updateSite = async (id: string, body: SitesDetailRequestBody): Promise<any> => {
	try {
		const response: SiteSchema = await apiService.put(`sites/${id}`, { json: body }).json();

		if (!response.data) {
			throw new Error(`Failed to update site with id: ${id}`);
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const updateSiteActivation = async (id: string, activate: boolean): Promise<any> => {
	try {
		const updateType = activate ? 'activate' : 'deactivate';
		const response: SiteSchema = await apiService.put(`sites/${id}/${updateType}`).json();

		if (!response.data) {
			throw new Error(`Failed to ${updateType} site with id: ${id}`);
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};
