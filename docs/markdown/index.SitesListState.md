# Interface: SitesListState

[index](../wiki/index).SitesListState

## Hierarchy

- `CacheEntityState`<[`SiteListModel`](../wiki/index#sitelistmodel), `string`\>

  ↳ **`SitesListState`**

## Table of contents

### Properties

- [entities](../wiki/index.SitesListState#entities)
- [error](../wiki/index.SitesListState#error)
- [ids](../wiki/index.SitesListState#ids)
- [isCreating](../wiki/index.SitesListState#iscreating)
- [isFetching](../wiki/index.SitesListState#isfetching)
- [loading](../wiki/index.SitesListState#loading)
- [paging](../wiki/index.SitesListState#paging)

## Properties

### entities

• `Optional` **entities**: `HashMap`<[`SiteResponse`](../wiki/index.SiteResponse)\>

#### Inherited from

CacheEntityState.entities

#### Defined in

node_modules/@datorama/akita/src/types.d.ts:7

___

### error

• `Optional` **error**: `any`

#### Inherited from

CacheEntityState.error

#### Defined in

node_modules/@datorama/akita/src/types.d.ts:10

___

### ids

• `Optional` **ids**: `string`[]

#### Inherited from

CacheEntityState.ids

#### Defined in

node_modules/@datorama/akita/src/types.d.ts:8

___

### isCreating

• **isCreating**: `boolean`

#### Inherited from

CacheEntityState.isCreating

#### Defined in

node_modules/@redactie/utils/dist/store/cacheEntity/cacheEntity.state.d.ts:10

___

### isFetching

• **isFetching**: `boolean`

#### Inherited from

CacheEntityState.isFetching

#### Defined in

node_modules/@redactie/utils/dist/store/cacheEntity/cacheEntity.state.d.ts:9

___

### loading

• `Optional` **loading**: `boolean`

#### Inherited from

CacheEntityState.loading

#### Defined in

node_modules/@datorama/akita/src/types.d.ts:9

___

### paging

• `Optional` **paging**: `Page`

#### Defined in

public/lib/store/sites/list/sites-list.model.ts:13
