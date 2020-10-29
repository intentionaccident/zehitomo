import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, compose, Action, Dispatch } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { useViewportScroll } from "framer-motion";
import styles from "./styles.sass";
import { DownloadIcon, SearchIcon, StarIcon, CircleIcon, CheckCircleFillIcon, CheckCircleIcon } from '@primer/octicons-react'

enum ActionType {
	SearchCompleted
}

interface SearchCompletedAction extends Action<ActionType> {
	result: SearchResult;
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
	height: number;
	urls: {
		small: string;
	}
	links: {
		download: string;
	}
	user: {
		username: string;
		name: string;
		links: {
			html: string;
		}
	}
}

function search({ dispatch, query, page, per_page = 10}: { dispatch: Dispatch, query: string, page: number, per_page?: number }): Promise<SearchResult> {
	const url = buildApiUrl(`search`);
	const queryParameters: Record<string, string> = {
		query,
		page: page.toString(),
		per_page: per_page.toString()
	};
	url.search = new URLSearchParams(queryParameters).toString();

	return fetch(url.toString())
		.then(response => response.json())
		.then(result => {
			dispatch({
				type: ActionType.SearchCompleted,
				result
			});
			return result;
		});
}

interface ImageGroup {
	images: Image[];
	name: string;
	id: string;
}

interface State {
	images: Record<string, Image>;
	imageGroups: ImageGroup[];
}

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
			whitelist: ["images"]
		},
		mainReducer
	),
	{
		images: {},
		imageGroups: []
	} as State as any,
	composeEnhancers()
)

function FavouriteGroupSelector(props: {image: Image, onHide?: () => void}): JSX.Element {
	const dispatch = useDispatch();
	const imageGroups = useSelector((state: State) => state.imageGroups);
	const [newGroupName, setNewGroupName] = React.useState("");
	const [newImageGroups, setNewImageGroups] = React.useState<ImageGroup[]>([]);
	const [selectedGroups, setSelectedGroups] = React.useState(
		(imageGroups.concat(newImageGroups)).filter(group => group.images.indexOf(props.image) >= 0)
	);

	function addGroup() {
		if (!newGroupName) {
			return;
		}

		const newGroup = {
			id: Math.random().toString(36).substring(7),
			images: [] as Image[],
			name: newGroupName
		};

		setNewImageGroups(newImageGroups.concat([newGroup]));
		setSelectedGroups(selectedGroups.concat([newGroup]));
		setNewGroupName("");
	}

	return <>
		<Modal.Header>
			<Modal.Title>Add to Favourites</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{newImageGroups.map(group => {
				const isInGroup = selectedGroups.indexOf(group) >= 0;
				return <Form.Check className="px-2 pb-2" key={group.id} type="checkbox" id={`image-group-${group.id}`}>
					<Form.Check.Input
						style={{display: "none"}}
						type="checkbox"
						checked={isInGroup}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							if (event.target.checked) {
								setSelectedGroups(selectedGroups.concat(group));
								return;
							}
							setSelectedGroups(selectedGroups.filter(selectedGroup => selectedGroup !== group));
						}}
						/>
					<Form.Check.Label className={`${styles.checkboxLabel}`}>
						<span>{
							isInGroup
								? <CheckCircleFillIcon size={20} />
								: <CircleIcon size={20} />
						}</span>

						<span className={styles.hoverImage}>
							<CheckCircleIcon size={20}/>
						</span>

						<span className={styles.activeImage}>{
							isInGroup
								? <CircleIcon size={20} />
								: <CheckCircleFillIcon size={20} />
						}</span>

						<span className="ml-2">{group.name}</span>
					</Form.Check.Label>
				</Form.Check>
			})}
			<Form.Control
				className="mt-2"
				type="text"
				placeholder="Add Group"
				value={newGroupName}
				onChange={(event) => setNewGroupName(event.target.value)}
				onBlur={addGroup}
				onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
					if (event.key === "Enter") {
						addGroup();
					}
				}}
			/>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="secondary" onClick={() => props.onHide && props.onHide()}>
			Close
			</Button>
			<Button variant="primary" onClick={() => props.onHide && props.onHide()}>
			Save Changes
			</Button>
		</Modal.Footer>
	</>
}

function ImageDisplay(props: {image: Image}): JSX.Element {
	const [showFavouritesModal, setShowFavouritesModal] = React.useState(false);

	return <>
		<div className={styles.image}>
			<img src={props.image.urls.small} />
			<div className={styles.overlay}>
				<div className="flex-fill" />
				<div className="d-flex text-white align-items-center p-2">
					<a href={props.image.user.links.html} className="div pl-2 text-white">{props.image.user.name ?? props.image.user.username}</a>
					<div className="flex-fill" />
					<Button variant="light" size="sm" onClick={() => setShowFavouritesModal(true)}><StarIcon size={20}/></Button>
					<Button as="a" variant="light" size="sm" href={props.image.links.download + "?force=true"} download={""}><DownloadIcon size={20}/></Button>
				</div>
			</div>
		</div>
		<Modal show={showFavouritesModal} onHide={() => setShowFavouritesModal(false)} centered>
			<FavouriteGroupSelector image={props.image} onHide={() => setShowFavouritesModal(false)} />
		</Modal>
	</>
}

interface ImageColumn {
	images: Image[],
	length: number,
	index: number,
}

function testScrollThreshold(
	scroll: number,
	scrollProgress: number,
	threshold: number
): boolean {
	const viewHeight = scroll / scrollProgress;
	return !isNaN(viewHeight) && isFinite(viewHeight) && viewHeight - scroll < threshold;
}

function ImageRack(props: {images: Image[], onScrollThreshold?: (isPastThreshold: boolean) => void}): JSX.Element {
	const { scrollY, scrollYProgress } = useViewportScroll()
	const { onScrollThreshold } = props;
	React.useEffect(() => {
		scrollYProgress.onChange(() => {
			const wasPastThreshold = testScrollThreshold(scrollY.getPrevious(), scrollYProgress.getPrevious(), 800);
			const isPastThreshold = testScrollThreshold(scrollY.get(), scrollYProgress.get(), 800);
			if (isPastThreshold !== wasPastThreshold) {
				onScrollThreshold(isPastThreshold);
			}
		})
		return () => scrollYProgress.clearListeners();
	}, [scrollY, scrollYProgress, onScrollThreshold]);

	const imageColumns: ImageColumn[] = [...Array(3)].map((_, index) => ({
		images: [],
		length: 0,
		index
	}));

	for(const image of props.images) {
		imageColumns[0].images.push(image);
		imageColumns[0].length += image.height;
		imageColumns.sort((a, b) => a.length - b.length);
	}

	imageColumns.sort((a, b) => a.index - b.index);

	return <div className="d-flex">
		{imageColumns.map(column => {
			return <div key={column.index}>{
				column.images.map(image => <ImageDisplay key={image.id} image={image}/>)
			}</div>
		})}
	</div>
}

function ImageSearch(): JSX.Element {
	const dispatch = useDispatch();
	const [searchTaskTimeout, setSearchTaskTimeout] = React.useState<NodeJS.Timeout | null>(null);
	const [images, setImages] = React.useState<Image[]>([]);
	const [query, setQuery] = React.useState<string>("");
	const [page, setPage] = React.useState<number>(1);
	const [request, setRequest] = React.useState<Promise<void>>(null);
	const [requestClearCancellationToken, setRequestClearCancellationToken] = React.useState<{isCancelled?: boolean}>({});

	function clearRequestAfterCompletion(newRequest: Promise<void>) {
		if (requestClearCancellationToken) {
			requestClearCancellationToken.isCancelled = true;
		}

		const cancellationToken: {isCancelled?: boolean} = {};
		setRequestClearCancellationToken(cancellationToken);

		newRequest.then(() => {
			if (cancellationToken.isCancelled === true) {
				return;
			}
			setRequest(null);
		})
		setRequest(newRequest);
	}

	const cachedImages = useSelector((state: State) => Object.values(state.images).slice(0, 20));

	return <Container>
		<Form.Control type="text" placeholder="Search" value={query} onChange={(event) => {
			if (searchTaskTimeout) {
				clearTimeout(searchTaskTimeout);
			}

			const value = event.target.value;
			setQuery(value);

			setSearchTaskTimeout(setTimeout(() => {
				setSearchTaskTimeout(null);
				setPage(1);
				setQuery(value);
				clearRequestAfterCompletion((request ?? Promise.resolve()).then(() => search({dispatch, query: value, page, per_page: 30})).then(searchResult => {
					setImages(searchResult.photos.results);
				}));
			}, 2000));
		}} />
		<ImageRack images={images.length === 0 ? cachedImages : images} onScrollThreshold={(isThresholdBreached) => {
			if (!isThresholdBreached || request || !query) {
				return;
			}

			const newPage = page + 1;
			setPage(newPage);

			clearRequestAfterCompletion(Promise.resolve()
				.then(() => search({dispatch, query, page: newPage, per_page: 30}))
				.then(searchResult => {
					setImages(images.concat(searchResult.photos.results));
				}));
		}}/>
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
