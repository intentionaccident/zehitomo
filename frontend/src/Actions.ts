import { Action, Dispatch } from "redux";
import { ImageGroup, Image } from "./State";

export enum ActionType {
	ImageGroupsUpdated,
	ImageGroupDeleted,
}

export interface ImageGroupsUpdatedAction extends Action<ActionType.ImageGroupsUpdated> {
	image: Image;
	groups: ImageGroup[];
}

export interface ImageGroupDeletedAction extends Action<ActionType.ImageGroupDeleted> {
	groupId: string;
}

function getBaseUrlPath(path: string): URL {
	if (process.env.UNSPLASH_API_KEY) {
		return new URL(`https://api.unsplash.com/${path}`);
	}

	if (process.env.NODE_ENV === "production") {
		return new URL(`${location.protocol}//${location.host}/api/${path}`);
	}

	return new URL(`http://localhost/api/${path}`);
}

function buildApiUrl(path: string, queryParameters?: Record<string, string>): string {
	const url = getBaseUrlPath(path);

	if (process.env.UNSPLASH_API_KEY) {
		if (!queryParameters) {
			queryParameters = {};
		}

		queryParameters.client_id = process.env.UNSPLASH_API_KEY;
	}

	if (queryParameters) {
		url.search = new URLSearchParams(queryParameters).toString();
	}

	return url.toString();
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

	const queryParameters: Record<string, string> = {
		query,
		page: page.toString(),
		per_page: per_page.toString()
	};

	return fetch(buildApiUrl(`search/photos`, queryParameters))
		.then(response => response.json())
		.then((result: PhotoSearchResult) => {
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
		image,
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