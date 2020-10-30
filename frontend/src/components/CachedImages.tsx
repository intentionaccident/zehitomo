import * as React from "react";
import { useSelector } from "react-redux";
import Container from 'react-bootstrap/Container';
import { State } from "src/State";
import { ImageRack } from "./ImageRack";


export function CachedImages(): JSX.Element {
	const images = useSelector((state: State) => Object.values(state.images));
	images.reverse();

	return <Container>
		<ImageRack
			images={images.slice(0, 30)} />
	</Container>;
}
