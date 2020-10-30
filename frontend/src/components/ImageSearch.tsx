import * as React from "react";
import { useDispatch } from "react-redux";
import Container from 'react-bootstrap/Container';
import { Image } from "src/State";
import { ImageRack } from "./ImageRack";
import { search } from "../Actions";
import { useLocation } from "react-router";
import queryString from 'query-string';

interface Request {
	page: number;
	query: string;
}

function compareRequests(a: Request, b: Request): boolean {
	if (a == b){
		return true;
	}

	if (a == null || b == null) {
		return false;
	}

	return a.page === b.page && a.query === b.query;
}

export function ImageSearch(): JSX.Element {
	const dispatch = useDispatch();
	const [images, setImages] = React.useState<Image[]>([]);

	const [desiredPage, setDesiredPage] = React.useState(1);
	const [totalPages, setTotalPages] = React.useState(1);

	const [sentRequest, setSentRequest] = React.useState<Request>(null);
	const [completedRequest, setCompletedRequest] = React.useState<Request>(null);

	const location = useLocation();
	const query = queryString.parse(location.search).query as string;

	React.useEffect(() => {
		// Don't make request if there is no query
		if (!query) {
			// If query got cleared we need to reset everything to the initial state
			if (sentRequest !== null) {
				setImages([])
				setSentRequest(null);
				setCompletedRequest(null);
				setDesiredPage(1);
				setTotalPages(1);
			}
			return;
		}

		// Don't make request if we have reached the end of the pages
		if (desiredPage > totalPages && totalPages > 0) {
			return;
		}

		const newRequest: Request = {
			page: desiredPage,
			query
		};

		// If the query changed we need to reset the page
		if (query !== sentRequest?.query) {
			newRequest.page = 1;
			setDesiredPage(1);
			setTotalPages(1);
		}

		// Don't make request if we have already sent the request
		if (compareRequests(sentRequest, newRequest)) {
			return;
		}

		search({
			dispatch,
			query: newRequest.query,
			page: newRequest.page,
			per_page: 30
		}).then(result => {
			setImages(
				(newRequest.page > 1 ? images : [])
					.concat(result.results)
					.filter((image, index, array) => array.findIndex(possibleDuplicate => possibleDuplicate.id === image.id) === index)
			)
			setTotalPages(result.total_pages);
			setCompletedRequest(newRequest);
		});

		setSentRequest(newRequest);
	}, [desiredPage, dispatch, images, query, sentRequest, totalPages]);

	const isLoading = !compareRequests(sentRequest, completedRequest);

	return <Container>
		<ImageRack
			images={images}
			isLoading={isLoading}
			onScrollThreshold={(isThresholdBreached) => {
				if (!isThresholdBreached || !query || isLoading || desiredPage >= totalPages) {
					return;
				}

				setDesiredPage(desiredPage + 1);
			}}
		/>
	</Container>;
}
