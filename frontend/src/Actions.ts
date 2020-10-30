import { Action, Dispatch } from "redux";
import { ImageGroup, Image } from "./State";

export enum ActionType {
	SearchCompleted,
	ImageGroupsUpdated,
	ImageGroupDeleted,
}

export interface SearchCompletedAction extends Action<ActionType.SearchCompleted> {
	result: PhotoSearchResult;
}

export interface ImageGroupsUpdatedAction extends Action<ActionType.ImageGroupsUpdated> {
	imageId: string;
	groups: ImageGroup[];
}

export interface ImageGroupDeletedAction extends Action<ActionType.ImageGroupDeleted> {
	groupId: string;
}

function buildApiUrl(path: string): URL {
	return new URL(`http://localhost/api/${path}`);
}

export interface PhotoSearchResult {
	results: Image[];
	total_pages: number;
}

export interface SearchResult {
	photos: PhotoSearchResult;
}

export function search({ dispatch, query, page, per_page = 10}: {
	dispatch: Dispatch,
	query: string,
	page: number,
	per_page?: number
}): Promise<PhotoSearchResult> {
	const url = buildApiUrl(`search/photos`);
	const queryParameters: Record<string, string> = {
		query,
		page: page.toString(),
		per_page: per_page.toString()
	};
	url.search = new URLSearchParams(queryParameters).toString();

	return fetch(url.toString())
		.then(response => response.json())
		.then((result: PhotoSearchResult) => {
			dispatch<SearchCompletedAction>({
				type: ActionType.SearchCompleted,
				result: result
			});
			return result;
		});
}

export function addToFavourites({ dispatch, image, groups }: {
	dispatch: Dispatch,
	image: Image,
	groups: ImageGroup[]
}): void {
	dispatch<ImageGroupsUpdatedAction>({
		type: ActionType.ImageGroupsUpdated,
		imageId: image.id,
		groups
	})
}

export function deleteGroup({ dispatch, groupId }: {
	dispatch: Dispatch,
	groupId: string
}): void {
	dispatch<ImageGroupDeletedAction>({
		type: ActionType.ImageGroupDeleted,
		groupId,
	})
}