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
