import { combineQueries } from '@datorama/akita';
import { CacheEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { sitesDetailQuery, SitesDetailQuery } from '../detail';

import { SiteListUIModel, SitesListState } from './sites-list.model';
import { sitesListStore, SitesListStore } from './sites-list.store';

export class SitesListQuery extends CacheEntityQuery<SiteListUIModel, SitesListState> {
	constructor(protected store: SitesListStore, protected detailQuery: SitesDetailQuery) {
		super(store);
	}

	public sites$ = this.selectAll();

	public getIsFetching(): boolean {
		return this.getValue().isFetching;
	}

	public selectUIState(): Observable<SiteListUIModel> {
		return combineQueries([
			this.select(['error', 'isFetching']),
			this.detailQuery.select(['error', 'isCreating']),
		]).pipe(
			map(([globalListUIState, globalDetailState]) => {
				const error = globalListUIState.error || globalDetailState.error;

				return {
					isCreating: globalDetailState.isCreating,
					isFetching: globalListUIState.isFetching,
					error,
				};
			})
		);
	}
}

export const sitesListQuery = new SitesListQuery(sitesListStore, sitesDetailQuery);
