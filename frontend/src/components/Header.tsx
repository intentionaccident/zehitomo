import * as React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import zehitomo from "../assets/zehitomo.svg";
import { useHistory, useLocation } from "react-router";
import queryString from 'query-string';
import { Link } from "react-router-dom";

export function Header(): JSX.Element {
	const [searchTaskTimeout, setSearchTaskTimeout] = React.useState<NodeJS.Timeout | null>(null);
	const location = useLocation();
	const searchQuery = queryString.parse(location.search).query as string;
	const [query, setQuery] = React.useState<string>(searchQuery ?? "");
	const history = useHistory();

	function redirectToSearch(query: string) {
		history.push({
			pathname: "/",
			search: `?query=${query}`
		});
	}

	return <Navbar bg="light" sticky="top">
		<Container className="px-4">
			<Navbar.Brand>
				<Link to="/">
					<img src={zehitomo} />
				</Link>
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
				}} />
			<Nav className="mr-auto">
				<Link to="/favourites" >
					<Nav.Link as="div">
						Favourites
					</Nav.Link>
				</Link>
			</Nav>
		</Container>
	</Navbar>;
}
