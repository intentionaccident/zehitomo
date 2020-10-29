import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { ImageGroupEntry } from "./ImageGroupEntry";
import { State, Image, ImageGroup } from "src/State";
import { addToFavourites } from "../Actions";

export function FavouriteGroupSelector(props: { image: Image; onHide?: () => void; }): JSX.Element {
	const dispatch = useDispatch();
	const imageGroups = useSelector((state: State) => state.imageGroups);
	const [newGroupName, setNewGroupName] = React.useState("");
	const [newImageGroups, setNewImageGroups] = React.useState<ImageGroup[]>([]);
	const [selectedGroups, setSelectedGroups] = React.useState(
		(imageGroups.concat(newImageGroups)).filter(group => group.imageIds.indexOf(props.image.id) >= 0)
	);

	function addGroup() {
		if (!newGroupName) {
			return;
		}

		const newGroup: ImageGroup = {
			id: Math.random().toString(36).substring(7),
			imageIds: [],
			name: newGroupName
		};

		setNewImageGroups(newImageGroups.concat([newGroup]));
		setSelectedGroups(selectedGroups.concat([newGroup]));
		setNewGroupName("");
	}

	return <>
		<Modal.Header>
			<Modal.Title>Add to Favourites</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{imageGroups.map(group => ({ group, isNew: false }))
				.concat(newImageGroups.map(group => ({ group, isNew: true })))
				.map(({ group, isNew }) => <ImageGroupEntry
					key={group.id}
					group={group}
					isSelected={selectedGroups.indexOf(group) >= 0}
					canDelete={isNew}
					onChange={(isSelected) => {
						if (isSelected) {
							setSelectedGroups(selectedGroups.concat(group));
							return;
						}
						setSelectedGroups(selectedGroups.filter(selectedGroup => selectedGroup !== group));
					}}
					onDelete={() => {
						setNewImageGroups(newImageGroups.filter(newGroup => newGroup !== group));
						setSelectedGroups(selectedGroups.filter(selectedGroup => selectedGroup !== group));
					}} />
				)}
			<Form.Control
				className="mt-2"
				type="text"
				placeholder="Add Group"
				value={newGroupName}
				onChange={(event) => setNewGroupName(event.target.value)}
				onBlur={addGroup}
				onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
					if (event.key === "Enter") {
						addGroup();
					}
				}} />
		</Modal.Body>
		<Modal.Footer>
			<Button variant="secondary" onClick={() => props.onHide && props.onHide()}>
				Cancel
			</Button>
			<Button variant="primary" onClick={() => {
				setNewImageGroups([]);
				addToFavourites({
					dispatch,
					image: props.image,
					groups: selectedGroups,
				});
				if (props.onHide) {
					props.onHide();
				}
			}}>
				Save
			</Button>
		</Modal.Footer>
	</>;
}
