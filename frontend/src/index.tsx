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

interface SearchResult {
	photos: {
		results: Image[];
	}
}

interface Image {
	id: string;
	urls: {
		thumb: string;
	}
}

function search(query: string): Promise<SearchResult> {
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

function ImageDisplay(props: {image: Image}): JSX.Element {
	return <img src={props.image.urls.thumb}></img>;
}

function ImageRack(props: {images: Image[]}): JSX.Element {
	return <>{props.images.map(image => <ImageDisplay key={image.id} image={image}/>)}</>
}

function ImageSearch(): JSX.Element {
	const [searchTaskTimeout, setSearchTaskTimeout] = React.useState<NodeJS.Timeout | null>(null);
	const [images, setImages] = React.useState<Image[]>([]);
	return <Container>
		<Form.Control type="text" placeholder="Search" onChange={(event) => {
			if (searchTaskTimeout) {
				clearTimeout(searchTaskTimeout);
			}
			const value = event.target.value;
			setSearchTaskTimeout(setTimeout(() => {
				setSearchTaskTimeout(null);
				search(value).then(searchResult => setImages(searchResult.photos.results));
			}, 3000));
		}} />
		<ImageRack images={images}/>
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
