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
		height: image.preview == null ? 0.1 :  image.preview.height / image.preview.width,
		object: image
	})), 3);

	return <Container>
		<div className="d-flex">
			{columns.map(column =>
				<div className={`${column.index === 0 ? "" : "ml-3"} ${styles.imageColumn}`} key={column.index}>
					{column.things.map(preview =>
						<div key={preview.group.id} className={`mb-3`}>
							{ preview.preview
								? <BasicImageDisplay image={preview.preview}>
									<div className={`${styles.favouriteGroupPreview} d-flex flex-column`}>
										<GroupActionPanel group={preview.group}/>
										<Link className="text-white flex-fill" to={`/favourites/${preview.group.id}`} />
										{
											preview.group.description
												&& <div className={`d-flex align-items-center justify-content-center p-2 text-white font-italic ${styles.favouriteGroupActionBar}`}>
													{preview.group.description}
												</div>
										}
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
