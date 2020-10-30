import * as React from "react";
import Container from "react-bootstrap/esm/Container";
import { useSelector } from "react-redux";
import { State } from "../State";
import { ImageDisplay } from "./ImageDisplay";
import { splitIntoGroups } from "./ImageRack";
import styles from "../styles.sass";

export function FavouriteGroupsDisplay(): JSX.Element {
	const groups = useSelector((state: State) => state.imageGroups);
	const previewImages = useSelector((state: State) => groups.map(group => ({
		group,
		preview: group.imageIds.length > 0 ? state.images[group.imageIds[0]] : null
	})));

	const columns = splitIntoGroups(previewImages.map(image => ({
		height: (image.preview?.height ?? 0) + 50,
		object: image
	})), 3);

	return <Container>
		<div className="d-flex">
			{columns.map(column => {
				return <div className={styles.imageColumn} key={column.index}>{column.things.map(preview => <>
					{preview.group.name}
					<ImageDisplay key={preview.group.id} image={preview.preview} />
				</>)}</div>;
			})}
		</div>
	</Container>;
}
