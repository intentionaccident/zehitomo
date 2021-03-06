import * as React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from "../styles.sass";
import { DownloadIcon, StarFillIcon, StarIcon } from '@primer/octicons-react';
import { Image, State } from "src/State";
import { ImageGroupEditor } from "./ImageGroupEditor";
import { useSelector } from "react-redux";
import { BasicImageDisplay } from "./BasicImageDisplay";

export function ImageDisplay(props: { image: Image }): JSX.Element {
	const [showFavouritesModal, setShowFavouritesModal] = React.useState(false);
	const groups = useSelector((state: State) =>
		state.imageGroups
			.filter(group => group.imageIds.indexOf(props.image.id) >= 0)
	);

	return <BasicImageDisplay image={props.image}>
		<div className={`${styles.standaloneImage}`}>
			<div className={`${styles.overlay}`}>
				<div className="d-flex text-white align-items-center p-2 flex-row-reverse">
					<Button variant="light" size="sm" onClick={() => setShowFavouritesModal(true)}>
						{ groups.length === 0
							? <StarIcon size={20} />
							: <StarFillIcon size={20} />
						}
					</Button>
				</div>

				<div className="flex-fill" />
				<div className="d-flex text-white align-items-center p-2">
					<a href={props.image.user.links.html} className="div pl-2 text-white">{props.image.user.name ?? props.image.user.username}</a>
					<div className="flex-fill" />
					<Button as="a" variant="light" size="sm" href={props.image.links.download + "?force=true"} download={""}>
						<DownloadIcon size={20} />
					</Button>
				</div>
			</div>
		</div>
		<Modal show={showFavouritesModal} onHide={() => setShowFavouritesModal(false)} centered>
			<ImageGroupEditor image={props.image} onHide={() => setShowFavouritesModal(false)} />
		</Modal>
	</BasicImageDisplay>
}
