import * as React from "react";
import Container from "react-bootstrap/esm/Container";
import { useSelector } from "react-redux";
import { State } from "../State";
import { splitIntoGroups } from "./ImageRack";
import styles from "../styles.sass";
import { BasicImageDisplay } from "./BasicImageDisplay";
import { Link } from "react-router-dom";
import { DeleteFavouritesGroupButton } from "./DeleteFavouritesGroupButton";

export function FavouriteGroupRack(): JSX.Element {
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
				return <div className={styles.imageColumn} key={column.index}>{column.things.map(preview =>
					<BasicImageDisplay key={preview.group.id} image={preview.preview}>
						<div className={`${styles.favouriteGroupPreview} d-flex flex-column`}>
							<div className="flex-fill"/>
							<div className={`d-flex align-items-center p-2 ${styles.favouriteGroupActionBar}`}>
								<Link className="text-white" to={`/favourites/${preview.group.id}`}>
									{preview.group.name}
								</Link>
								<div className="flex-fill"/>
								<DeleteFavouritesGroupButton group={preview.group} />
							</div>
						</div>
					</BasicImageDisplay>
				)}</div>;
			})}
		</div>
	</Container>;
}
