import apiService from './services/api-service';

export const getSites = async (): Promise<any[] | null> => {
	try {
		const response: any = await apiService.get('sites').json();

		return response._embedded;
	} catch (err) {
		console.error(err);
		return null;
	}
};
