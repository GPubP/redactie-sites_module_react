import { LanguageSchema } from '@redactie/language-module';
import { MultilanguageYup } from '@redactie/utils';

export const SITES_DETAIL_VALIDATION_SCHEMA = (languages: LanguageSchema[]): any =>
	MultilanguageYup.object().shape({
		name: MultilanguageYup.string().required('Naam is verplicht'),
		url: MultilanguageYup.object().validateMultiLanguage(
			languages,
			MultilanguageYup.string()
				.matches(
					new RegExp(
						'^https?://(www.)?[a-zA-Z0-9_-]+(.[a-zA-Z]+)+((/)[w#]+)*(/w+?[a-zA-Z0-9_]+=w+(&[a-zA-Z0-9_]+=w+)*)?$'
					),
					'Gelieve een geldige url in te vullen'
				)
				.required('Url is verplicht')
		),
		languages: MultilanguageYup.array().min(1, 'Gelieve minstens één taal te kiezen'),
	});
