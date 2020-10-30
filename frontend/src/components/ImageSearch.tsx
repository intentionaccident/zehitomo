import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from 'react-bootstrap/Container';
import { Image, State } from "src/State";
import { ImageRack } from "./ImageRack";
import { search } from "../Actions";
import { useLocation } from "react-router";
import queryString from 'query-string';

export function ImageSearch(): JSX.Element {
	const dispatch = useDispatch();
	const [images, setImages] = React.useState<Image[]>([]);
	const [page, setPage] = React.useState(0);
	const [loadedPage, setLoadedPage] = React.useState(0);
	const [loadedQuery, setLoadedQuery] = React.useState<string>(undefined);
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
		<ImageRack
			images={query ? images : cachedImages}
			isLoading={query !== loadedQuery || loadedPage !== page}
			onScrollThreshold={(isThresholdBreached) => {
				if (!isThresholdBreached || loadedPage < page || !query) {
					return;
				}

				setPage(page + 1);
			}}
		/>
	</Container>;
}
