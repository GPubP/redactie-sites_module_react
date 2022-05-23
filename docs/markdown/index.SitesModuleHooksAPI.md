# Interface: SitesModuleHooksAPI

[index](../wiki/index).SitesModuleHooksAPI

## Table of contents

### Properties

- [usePaginatedSites](../wiki/index.SitesModuleHooksAPI#usepaginatedsites)
- [useSite](../wiki/index.SitesModuleHooksAPI#usesite)
- [useSitesUIStates](../wiki/index.SitesModuleHooksAPI#usesitesuistates)

## Properties

### usePaginatedSites

• **usePaginatedSites**: `UsePaginatedSites`

#### Defined in

public/lib/api/api.types.ts:36

___

### useSite

• **useSite**: `UseSite`

#### Defined in

public/lib/api/api.types.ts:35

___

### useSitesUIStates

• **useSitesUIStates**: <T\>(`siteIds?`: `T`) => `T` extends `string` ? [`SiteListUIModel`, `SiteDetailUIModel` \| `undefined`] : [`SiteListUIModel`, `Record`<`string`, `SiteDetailUIModel`\> \| `undefined`]

#### Type declaration

▸ <`T`\>(`siteIds?`): `T` extends `string` ? [`SiteListUIModel`, `SiteDetailUIModel` \| `undefined`] : [`SiteListUIModel`, `Record`<`string`, `SiteDetailUIModel`\> \| `undefined`]

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `string`[] |

##### Parameters

| Name | Type |
| :------ | :------ |
| `siteIds?` | `T` |

##### Returns

`T` extends `string` ? [`SiteListUIModel`, `SiteDetailUIModel` \| `undefined`] : [`SiteListUIModel`, `Record`<`string`, `SiteDetailUIModel`\> \| `undefined`]

#### Defined in

public/lib/api/api.types.ts:37
