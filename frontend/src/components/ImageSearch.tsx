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

export function Header(props: {searchQuery: string}): JSX.Element {
	const [searchTaskTimeout, setSearchTaskTimeout] = React.useState<NodeJS.Timeout | null>(null);
	const [query, setQuery] = React.useState<string>(props.searchQuery ?? "");
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
	const [page, setPage] = React.useState(1);
	const [loadedPage, setLoadedPage] = React.useState(0);
	const [loadedQuery, setLoadedQuery] = React.useState("");
	const location = useLocation();
	const query = queryString.parse(location.search).query as string;

	React.useEffect(() => {
		if (!query || (query === loadedQuery && loadedPage === page)) {
			return;
		}

		let requestedPage = page;

		if (query !== loadedQuery) {
			setLoadedPage(0);
			setPage(1);
			requestedPage = 1;
		}

		search({
			dispatch,
			query,
			page: requestedPage,
			per_page: 30
		}).then(result => {
			setImages(
				(requestedPage > 1 ? images : [])
					.concat(result.photos.results)
					.filter((image, index, array) => array.findIndex(possibleDuplicate => possibleDuplicate.id === image.id) === index)
			)
			setLoadedPage(requestedPage);
			setLoadedQuery(query);
		});
	}, [dispatch, query, loadedQuery, page, loadedPage, images]);

	const cachedImages = useSelector((state: State) => Object.values(state.images).slice(0, 20));

	return <Container>
		<Header searchQuery={query}/>
		<ImageRack images={images.length === 0 ? cachedImages : images} onScrollThreshold={(isThresholdBreached) => {
			if (!isThresholdBreached || loadedPage < page) {
				return;
			}

			setPage(page + 1);
		}} />
	</Container>;
}
