import * as React from "react";
import Modal from "react-bootstrap/esm/Modal";
import Button from 'react-bootstrap/Button';
import { useDispatch } from "react-redux";
import { ImageGroup } from "../State";
import { TrashIcon } from "@primer/octicons-react";
import { deleteGroup } from "../Actions";


export function DeleteFavouritesGroupButton(props: { group: ImageGroup; variant?: string }): JSX.Element {
	const dispatch = useDispatch();
	const [showConfirmation, setShowConfirmation] = React.useState(false);
	function modalClosed(accepted: boolean) {
		setShowConfirmation(false);
		if (!accepted) {
			return;
		}

		deleteGroup({
			dispatch,
			groupId: props.group.id
		});
	}

	return <><Button
		variant={ props.variant ?? "light" }
		size="sm"
		onClick={() => setShowConfirmation(true)}
	>
		<TrashIcon size={20} />
	</Button>

		<Modal show={showConfirmation} onHide={() => modalClosed(false)} centered>
			<Modal.Body>Are you sure you want to delete the favourites group {props.group.name}?</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => modalClosed(false)}>
					Cancel
			</Button>
				<Button variant="primary" onClick={() => modalClosed(true)}>
					Confirm
			</Button>
			</Modal.Footer>
		</Modal>
	</>;
}
