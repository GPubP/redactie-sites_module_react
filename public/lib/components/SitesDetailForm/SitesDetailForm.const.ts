import { object, string } from 'yup';

export const SITES_DETAIL_VALIDATION_SCHEMA = object().shape({
	name: string().required(),
	url: string()
		.url()
		.required(),
});
