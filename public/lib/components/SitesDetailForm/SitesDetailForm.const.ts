import { object, string } from 'yup';

export const SITES_DETAIL_VALIDATION_SCHEMA = object().shape({
	name: string().required('Naam is verplicht'),
	url: string()
		.url('Gelieve een geldige url in te vullen')
		.required('Url is verplicht'),
});
