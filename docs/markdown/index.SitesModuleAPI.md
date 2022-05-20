# Interface: SitesModuleAPI

[index](../wiki/index).SitesModuleAPI

## Table of contents

### Properties

- [config](../wiki/index.SitesModuleAPI#config)
- [hooks](../wiki/index.SitesModuleAPI#hooks)
- [registerSiteUpdateTab](../wiki/index.SitesModuleAPI#registersiteupdatetab)
- [routes](../wiki/index.SitesModuleAPI#routes)
- [store](../wiki/index.SitesModuleAPI#store)

## Properties

### config

• **config**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ALERT_CONTAINER_IDS` | typeof `ALERT_CONTAINER_IDS` |

#### Defined in

public/lib/sites.types.ts:65

___

### hooks

• **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `usePaginatedSites` | `UsePaginatedSites` |
| `useSite` | `UseSite` |
| `useSitesUIStates` | <T\>(`siteIds?`: `T`) => `T` extends `string` ? [`SiteListUIModel`, `SiteDetailUIModel` \| `undefined`] : [`SiteListUIModel`, `Record`<`string`, `SiteDetailUIModel`\> \| `undefined`] |

#### Defined in

public/lib/sites.types.ts:60

___

### registerSiteUpdateTab

• **registerSiteUpdateTab**: (`name`: `string`, `options`: [`ExternalTabOptions`](../wiki/index.ExternalTabOptions)) => `void`

#### Type declaration

▸ (`name`, `options`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options` | [`ExternalTabOptions`](../wiki/index.ExternalTabOptions) |

##### Returns

`void`

#### Defined in

public/lib/sites.types.ts:68

___

### routes

• **routes**: `Routes`

#### Defined in

public/lib/sites.types.ts:50

___

### store

• **store**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `sites` | { `facade`: `Pick`<`SitesFacade`, ``"getSite"`` \| ``"getSitesPaginated"`` \| ``"updateSite"`` \| ``"selectSite"`` \| ``"hasSite"``\> ; `service`: `SitesApiService`  } |
| `sites.facade` | `Pick`<`SitesFacade`, ``"getSite"`` \| ``"getSitesPaginated"`` \| ``"updateSite"`` \| ``"selectSite"`` \| ``"hasSite"``\> |
| `sites.service` | `SitesApiService` |

#### Defined in

public/lib/sites.types.ts:51
