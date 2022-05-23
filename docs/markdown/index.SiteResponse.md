# Interface: SiteResponse

[index](../wiki/index).SiteResponse

## Table of contents

### Properties

- [data](../wiki/index.SiteResponse#data)
- [meta](../wiki/index.SiteResponse#meta)
- [userIsMember](../wiki/index.SiteResponse#userismember)
- [uuid](../wiki/index.SiteResponse#uuid)

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contentTypes` | `string`[] |
| `description` | `string` |
| `languages` | `string`[] \| `LanguageSchema`[] |
| `modulesConfig` | [`ModuleSettings`](../wiki/index.ModuleSettings)[] |
| `name` | `string` |
| `url` | `string` |

#### Defined in

public/lib/services/sites/sites.service.types.ts:8

___

### meta

• **meta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `active` | `boolean` |
| `contentItemsCount?` | `number` |
| `createdAt` | `string` |
| `tenant` | `string` |
| `updatedAt` | `string` |

#### Defined in

public/lib/services/sites/sites.service.types.ts:16

___

### userIsMember

• `Optional` **userIsMember**: `boolean`

#### Defined in

public/lib/services/sites/sites.service.types.ts:23

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/sites/sites.service.types.ts:7
