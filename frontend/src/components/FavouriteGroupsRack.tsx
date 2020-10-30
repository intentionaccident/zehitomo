import * as React from "react";
import Container from "react-bootstrap/esm/Container";
import { useSelector } from "react-redux";
import { ImageGroup, State } from "../State";
import { splitIntoGroups } from "./ImageRack";
import styles from "../styles.sass";
import { BasicImageDisplay } from "./BasicImageDisplay";
import { Link } from "react-router-dom";
import { DeleteFavouritesGroupButton } from "./DeleteFavouritesGroupButton";


function GroupActionPanel(props: {group: ImageGroup}): JSX.Element {
	return <div className={`d-flex align-items-center p-2 ${styles.favouriteGroupActionBar}`}>
		<Link className="text-white" to={`/favourites/${props.group.id}`}>
			{props.group.name}
		</Link>
		<div className="flex-fill"/>
		<div className="ml-2">
			<DeleteFavouritesGroupButton group={props.group} />
		</div>
	</div>
}

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
			{columns.map(column =>
				<div className={styles.imageColumn} key={column.index}>
					{column.things.map(preview =>
						<div key={preview.group.id} className={`${column.index === 0 ? "" : "ml-3"} mb-3`}>
							{ preview.preview
								? <BasicImageDisplay image={preview.preview}>
									<div className={`${styles.favouriteGroupPreview} d-flex flex-column`}>
										<div className="flex-fill"/>
										<GroupActionPanel group={preview.group}/>
									</div>
								</BasicImageDisplay>
								: <GroupActionPanel group={preview.group}/>
							}
						</div>
					)}
				</div>
			)}
		</div>
	</Container>;
}
