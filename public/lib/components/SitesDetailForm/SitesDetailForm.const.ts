import { LanguageSchema } from '@redactie/language-module';
import { MultilanguageYup } from '@redactie/utils';

export const SITES_DETAIL_VALIDATION_SCHEMA = (languages: LanguageSchema[]): any =>
	MultilanguageYup.object().shape({
		name: MultilanguageYup.string().required('Naam is verplicht'),
		url: MultilanguageYup.lazy(value => {
			switch (typeof value) {
				case 'object':
					return MultilanguageYup.object().validateMultiLanguage(
						languages,
						MultilanguageYup.string()
							.url('Gelieve een geldige url in te vullen')
							.required('Url is verplicht')
					); // schema for object
				case 'string':
					return MultilanguageYup.string()
						.url('Gelieve een geldige url in te vullen')
						.required('Url is verplicht');
				default:
					return MultilanguageYup.string()
						.url('Gelieve een geldige url in te vullen')
						.required('Url is verplicht');
			}
		}),
		languages: MultilanguageYup.array().min(1, 'Gelieve minstens één taal te kiezen'),
	});
