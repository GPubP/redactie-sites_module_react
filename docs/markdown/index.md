# Module: index

## Table of contents

### Interfaces

- [CreateSitePayload](../wiki/index.CreateSitePayload)
- [ExternalTabOptions](../wiki/index.ExternalTabOptions)
- [ExternalTabProps](../wiki/index.ExternalTabProps)
- [GetSitePayload](../wiki/index.GetSitePayload)
- [ModuleSettings](../wiki/index.ModuleSettings)
- [SiteResponse](../wiki/index.SiteResponse)
- [SitesListState](../wiki/index.SitesListState)
- [SitesModuleAPI](../wiki/index.SitesModuleAPI)
- [UpdateSiteActivationPayload](../wiki/index.UpdateSiteActivationPayload)
- [UpdateSitePayload](../wiki/index.UpdateSitePayload)

### Type aliases

- [GetSitesPayload](../wiki/index#getsitespayload)
- [SiteDetailModel](../wiki/index#sitedetailmodel)
- [SiteListModel](../wiki/index#sitelistmodel)
- [SitesDetailState](../wiki/index#sitesdetailstate)
- [SitesMetaResponse](../wiki/index#sitesmetaresponse)
- [SitesResponse](../wiki/index#sitesresponse)
- [ValidationSchema](../wiki/index#validationschema)

## Type aliases

### GetSitesPayload

Ƭ **GetSitesPayload**: `SearchParams`

#### Defined in

public/lib/services/sites/sites.service.types.ts:43

___

### SiteDetailModel

Ƭ **SiteDetailModel**: [`SiteResponse`](../wiki/index.SiteResponse)

#### Defined in

public/lib/store/sites/detail/sites-detail.model.ts:5

___

### SiteListModel

Ƭ **SiteListModel**: [`SiteResponse`](../wiki/index.SiteResponse)

#### Defined in

public/lib/store/sites/list/sites-list.model.ts:5

___

### SitesDetailState

Ƭ **SitesDetailState**: `CacheEntityState`<[`SiteDetailModel`](../wiki/index#sitedetailmodel), `string`\>

#### Defined in

public/lib/store/sites/detail/sites-detail.model.ts:12

___

### SitesMetaResponse

Ƭ **SitesMetaResponse**: `Page`

#### Defined in

public/lib/services/sites/sites.service.types.ts:26

___

### SitesResponse

Ƭ **SitesResponse**: `EmbeddedResponse`<[`SiteResponse`](../wiki/index.SiteResponse)\>

#### Defined in

public/lib/services/sites/sites.service.types.ts:4

___

### ValidationSchema

Ƭ **ValidationSchema**: `Record`<`string`, `any`\>

#### Defined in

public/lib/services/sites/sites.service.types.ts:50
