import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import { Image, State } from "src/State";
import { ImageRack } from "./ImageRack";
import { search } from "../Actions";
import zehitomo from "../assets/zehitomo.svg";
import { useHistory, useLocation } from "react-router";
import queryString from 'query-string';

export function Header(): JSX.Element {
	const [searchTaskTimeout, setSearchTaskTimeout] = React.useState<NodeJS.Timeout | null>(null);
	const [query, setQuery] = React.useState<string>("");
	const history = useHistory();

	function redirectToSearch(query: string) {
		history.push({
			pathname: "/",
			search: `?query=${query}`
		})
	}

	return <Navbar bg="light" fixed="top">
		<Container className="px-4">
			<Navbar.Brand>
				<img src={zehitomo}/>
			</Navbar.Brand>
			<Form.Control
				type="text"
				placeholder="Search"
				value={query}
				onChange={(event) => {
					if (searchTaskTimeout) {
						clearTimeout(searchTaskTimeout);
					}

					const value = event.target.value;
					setQuery(value);

					setSearchTaskTimeout(setTimeout(() => {
						setSearchTaskTimeout(null);
						redirectToSearch(value);
					}, 2000));
				}}
				onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
					if (event.key !== "Enter") {
						return;
					}

					if (searchTaskTimeout) {
						clearTimeout(searchTaskTimeout);
					}

					setSearchTaskTimeout(null);
					redirectToSearch(query);
				}}
			/>
			<Nav className="mr-auto">
				<Nav.Link href="/favourites">Favourites</Nav.Link>
			</Nav>
		</Container>
	</Navbar>
}

export function ImageSearch(): JSX.Element {
	const dispatch = useDispatch();
	const [images, setImages] = React.useState<Image[]>([]);
	const [page, setPage] = React.useState<number>(1);
	const [request, setRequest] = React.useState<Promise<void>>(null);
	const [requestClearCancellationToken, setRequestClearCancellationToken] = React.useState<{ isCancelled?: boolean; }>({});
	const location = useLocation();
	const query = queryString.parse(location.search).query as string;

	React.useEffect(() => {
		if (!query) {
			return;
		}

		search({
			dispatch,
			query,
			page: 1,
			per_page: 30
		}).then(result => setImages(result.photos.results));
	}, [query, dispatch]);

	function clearRequestAfterCompletion(newRequest: Promise<void>) {
		if (requestClearCancellationToken) {
			requestClearCancellationToken.isCancelled = true;
		}

		const cancellationToken: { isCancelled?: boolean; } = {};
		setRequestClearCancellationToken(cancellationToken);

		newRequest.then(() => {
			if (cancellationToken.isCancelled === true) {
				return;
			}
			setRequest(null);
		});
		setRequest(newRequest);
	}

	const cachedImages = useSelector((state: State) => Object.values(state.images).slice(0, 20));

	return <Container>
		<Header />
		<ImageRack images={images.length === 0 ? cachedImages : images} onScrollThreshold={(isThresholdBreached) => {
			// if (!isThresholdBreached || request || !query) {
			// 	return;
			// }

			// const newPage = page + 1;
			// setPage(newPage);

			// clearRequestAfterCompletion(Promise.resolve()
			// 	.then(() => search({ dispatch, query, page: newPage, per_page: 30 }))
			// 	.then(searchResult => {
			// 		setImages(images.concat(searchResult.photos.results));
			// 	}));
		}} />
	</Container>;
}
