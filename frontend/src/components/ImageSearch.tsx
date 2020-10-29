import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Image, State } from "src/State";
import { ImageRack } from "./ImageRack";
import { search } from "../Actions";

export function ImageSearch(): JSX.Element {
	const dispatch = useDispatch();
	const [searchTaskTimeout, setSearchTaskTimeout] = React.useState<NodeJS.Timeout | null>(null);
	const [images, setImages] = React.useState<Image[]>([]);
	const [query, setQuery] = React.useState<string>("");
	const [page, setPage] = React.useState<number>(1);
	const [request, setRequest] = React.useState<Promise<void>>(null);
	const [requestClearCancellationToken, setRequestClearCancellationToken] = React.useState<{ isCancelled?: boolean; }>({});

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
				clearRequestAfterCompletion((request ?? Promise.resolve()).then(() => search({ dispatch, query: value, page, per_page: 30 })).then(searchResult => {
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
				.then(() => search({ dispatch, query, page: newPage, per_page: 30 }))
				.then(searchResult => {
					setImages(images.concat(searchResult.photos.results));
				}));
		}} />
	</Container>;
}
