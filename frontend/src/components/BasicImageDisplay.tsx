import * as React from "react";
import styles from "../styles.sass";
import { Image } from "src/State";

export function BasicImageDisplay(props: { image: Image; children?: JSX.Element | JSX.Element[]; }): JSX.Element {
	return <div
		className={styles.image}
		style={{
			paddingBottom: `${props.image.height / props.image.width * 100}%`,
			backgroundColor: props.image.color
		}}
	>
		<img src={props.image.urls.small} />
		<div className={styles.overlay}>
			{props.children}
		</div>
	</div>;
}
