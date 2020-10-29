import * as React from "react";
import Form from 'react-bootstrap/Form';
import styles from "../styles.sass";
import { CircleIcon, CheckCircleFillIcon, CheckCircleIcon, XIcon } from '@primer/octicons-react';
import { ImageGroup } from "src/State";

export function ImageGroupEntry(props: {
	group: ImageGroup;
	isSelected?: boolean;
	canDelete?: boolean;
	onChange?: (isSelected: boolean) => void;
	onDelete?: () => void;
}): JSX.Element {
	return <Form.Check className="px-2 pb-2" key={props.group.id} type="checkbox" id={`image-group-${props.group.id}`}>
		<Form.Check.Input
			style={{ display: "none" }}
			type="checkbox"
			checked={props.isSelected}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				if (props.onChange) {
					props.onChange(event.target.checked);
				}
			}} />
		<div className="d-flex align-items-center">
			<Form.Check.Label className={`${styles.checkboxLabel}`}>
				<span>{props.isSelected
					? <CheckCircleFillIcon size={20} />
					: <CircleIcon size={20} />}</span>

				<span className={styles.hoverImage}>
					<CheckCircleIcon size={20} />
				</span>

				<span className={styles.activeImage}>{props.isSelected
					? <CircleIcon size={20} />
					: <CheckCircleFillIcon size={20} />}</span>

				<span className="ml-2">{props.group.name}</span>
			</Form.Check.Label>
			<div className="flex-fill"></div>
			{props.canDelete &&
				<div style={{ cursor: "pointer" }} onClick={() => {
					if (props.onDelete) {
						props.onDelete();
					}
				}}><XIcon size={20} /></div>}
		</div>
	</Form.Check>;
}
