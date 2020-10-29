import * as React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from "../styles.sass";
import { DownloadIcon, StarIcon } from '@primer/octicons-react';
import { Image } from "src/State";
import { FavouriteGroupSelector } from "./FavouriteGroupSelector";


export function ImageDisplay(props: { image: Image; }): JSX.Element {
	const [showFavouritesModal, setShowFavouritesModal] = React.useState(false);

	return <>
		<div className={styles.image}>
			<img src={props.image.urls.small} />
			<div className={styles.overlay}>
				<div className="flex-fill" />
				<div className="d-flex text-white align-items-center p-2">
					<a href={props.image.user.links.html} className="div pl-2 text-white">{props.image.user.name ?? props.image.user.username}</a>
					<div className="flex-fill" />
					<Button variant="light" size="sm" onClick={() => setShowFavouritesModal(true)}><StarIcon size={20} /></Button>
					<Button as="a" variant="light" size="sm" href={props.image.links.download + "?force=true"} download={""}><DownloadIcon size={20} /></Button>
				</div>
			</div>
		</div>
		<Modal show={showFavouritesModal} onHide={() => setShowFavouritesModal(false)} centered>
			<FavouriteGroupSelector image={props.image} onHide={() => setShowFavouritesModal(false)} />
		</Modal>
	</>;
}
