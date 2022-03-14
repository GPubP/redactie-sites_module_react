import { LanguagesModuleAPI } from '@redactie/language-module';
import Core from '@redactie/redactie-core';

class LanguagesConnector {
	public apiName = 'languages-module';
	public api: LanguagesModuleAPI;

	constructor() {
		this.api = Core.modules.getModuleAPI<LanguagesModuleAPI>(this.apiName);
	}

	public get languagesFacade(): LanguagesModuleAPI['store']['languages']['facade'] {
		return this.api.store.languages.facade;
	}

	public get hooks(): LanguagesModuleAPI['hooks'] {
		return this.api.hooks;
	}
}

const languagesConnector = new LanguagesConnector();

export default languagesConnector;
