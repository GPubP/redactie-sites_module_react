import apiService from './services/api-service';
import { SiteSchema, SitesDetailRequestBody, SitesSchema } from './sites.types';

export const getSites = async (): Promise<SiteSchema[] | null> => {
	try {
		const response: SitesSchema = await apiService.get('sites').json();

		return response._embedded;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const createSite = async (body: SitesDetailRequestBody): Promise<any | null> => {
	try {
		// TODO: add typings for response
		const response: any = await apiService.post('sites', { json: body }).json();

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
		const response = await apiService.get(`sites/${id}`).json();

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
		const response = await apiService.put(`sites/${id}`, { json: body }).json();

		if (!response.data) {
			throw new Error(`Failed to update site with id: ${id}`);
		}

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
};
