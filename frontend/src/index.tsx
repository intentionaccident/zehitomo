import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, compose, Action } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { ImageSearch } from "./components/ImageSearch";
import { State, Image } from "./State";
import { ActionType, SearchCompletedAction, ImageAddedToFavouritesAction } from "./Actions";
import { Header } from "./components/Header";

function mainReducer(state: State, action: Action<ActionType>): State {
	switch (action.type) {
		case ActionType.SearchCompleted: {
			const searchCompletedAction = action as SearchCompletedAction;
			return {
				...state,
				images: {
					...state.images,
					...searchCompletedAction.result.photos.results.reduce((total, next) => {
						total[next.id] = next;
						return total;
					}, {} as Record<string, Image>)
				}
			}
		} case ActionType.ImageAddedToFavourites: {
			const imageAddedToFavouritesAction = action as ImageAddedToFavouritesAction;
			const newGroups = imageAddedToFavouritesAction.groups.filter(group =>
				state.imageGroups.findIndex(existingGroup => existingGroup.id === group.id) < 0
			);

			return {
				...state,
				imageGroups: state.imageGroups.map(group => {
					const updatedGroup = imageAddedToFavouritesAction.groups.find(selectedGroup => selectedGroup.id === group.id);
					if (!updatedGroup) {
						return group;
					}
					return {
						...group,
						imageIds: [...group.imageIds, imageAddedToFavouritesAction.imageId]
					}
				}).concat(newGroups.map(group => {
					group.imageIds = [ imageAddedToFavouritesAction.imageId ]
					return group;
				}))
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
				<Route exact path="/">
					<ImageSearch/>
				</Route>
				<Route path="/favourites">
					Hello
				</Route>
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.getElementsByTagName("body")[0]
);
