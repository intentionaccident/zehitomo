import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, compose, Action } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { ImageSearch } from "./components/ImageSearch";
import { State, Image } from "./State";
import { ActionType, SearchCompletedAction, ImageGroupsUpdatedAction, ImageGroupDeletedAction } from "./Actions";
import { Header } from "./components/Header";
import { FavouriteGroupRack } from "./components/FavouriteGroupsRack";
import { FavouriteGroupDisplay } from "./components/FavouriteGroupDisplay";

function mainReducer(state: State, action: Action<ActionType>): State {
	switch (action.type) {
		case ActionType.SearchCompleted: {
			const searchCompletedAction = action as SearchCompletedAction;
			return {
				...state,
				images: {
					...state.images,
					...searchCompletedAction.result.results.reduce((total, next) => {
						total[next.id] = next;
						return total;
					}, {} as Record<string, Image>)
				}
			}
		} case ActionType.ImageGroupsUpdated: {
			const imageGroupsUpdatedAction = action as ImageGroupsUpdatedAction;
			const newGroups = imageGroupsUpdatedAction.groups.filter(group =>
				state.imageGroups.findIndex(existingGroup => existingGroup.id === group.id) < 0
			);

			return {
				...state,
				imageGroups: state.imageGroups.map(existingGroup => {
					const groupShouldContainImage = imageGroupsUpdatedAction.groups.find(group => group.id === existingGroup.id) != null;
					const groupUsedToContainImage = existingGroup.imageIds.indexOf(imageGroupsUpdatedAction.imageId) >= 0;
					if (groupShouldContainImage === groupUsedToContainImage) {
						return existingGroup;
					}

					if (groupUsedToContainImage && !groupShouldContainImage) {
						return {
							...existingGroup,
							imageIds: existingGroup.imageIds.filter(id => id !== imageGroupsUpdatedAction.imageId)
						}
					}

					return {
						...existingGroup,
						imageIds: [...existingGroup.imageIds, imageGroupsUpdatedAction.imageId]
					}
				}).concat(newGroups.map(group => {
					group.imageIds = [ imageGroupsUpdatedAction.imageId ]
					return group;
				}))
			};
		} case ActionType.ImageGroupDeleted: {
			const imageGroupDeletedAction = action as ImageGroupDeletedAction;
			return {
				...state,
				imageGroups: state.imageGroups.filter(group => group.id !== imageGroupDeletedAction.groupId)
			};
		}
	}
	return state;
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	persistReducer(
		{
			key: "root",
			storage,
			whitelist: ["images", "imageGroups"]
		},
		mainReducer
	),
	{
		images: {},
		imageGroups: []
	} as State as any,
	composeEnhancers()
)

const persistor = persistStore(store);
ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter>
				<Header/>
				<Switch>
					<Route exact path="/">
						<ImageSearch/>
					</Route>
					<Route path="/favourites/:groupId">
						<FavouriteGroupDisplay/>
					</Route>
					<Route path="/favourites">
						<FavouriteGroupRack/>
					</Route>
				</Switch>
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.getElementsByTagName("body")[0]
);
