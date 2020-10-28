import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, compose, Action, Dispatch } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react'

enum ActionType {
	SearchCompleted
}

function buildApiUrl(path: string): URL {
	return new URL(`http://localhost/api/${path}`);
}

interface SearchResults {

}

function search(query: string): Promise<SearchResults> {
	const url = buildApiUrl(`search`);
	const queryParameters: Record<string, string> = {
		query
	};
	url.search = new URLSearchParams(queryParameters).toString();

	return fetch(url.toString())
		.then(response => response.json());
}

interface IState {

}

function contestReducer(state: IState, action: Action<ActionType>): IState {
	return state;
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	persistReducer(
		{
			key: "root",
			storage,
			whitelist: []
		},
		contestReducer
	),
	{
		musicPlayer: {
			playing: false,
			videoId: null
		},
	} as IState as any
)

function ImageDisplay(): JSX.Element {
	return null;
}

function ImageRack(): JSX.Element {
	return null;
}

function ImageSearch(): JSX.Element {
	const [searchTaskTimeout, setSearchTaskTimeout] = React.useState<NodeJS.Timeout | null>(null);
	return <Container>
		<Form.Control type="text" placeholder="Search" onChange={(event) => {
			if (searchTaskTimeout) {
				clearTimeout(searchTaskTimeout);
			}
			const value = event.target.value;
			setSearchTaskTimeout(setTimeout(() => {
				setSearchTaskTimeout(null);
				search(value).then(console.log);
			}, 3000));
		}} />
	</Container>
}

const persistor = persistStore(store);
ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter>
				<ImageSearch/>
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.getElementsByTagName("body")[0]
);
