import * as React from "react";
import { useViewportScroll } from "framer-motion";
import { Image } from "src/State";
import { ImageDisplay } from "./ImageDisplay";
import styles from "../styles.sass";

interface Column<T> {
	things: T[],
	length: number,
	index: number,
}

export function testScrollThreshold(
	scroll: number,
	scrollProgress: number,
	threshold: number
): boolean {
	const viewHeight = scroll / scrollProgress;
	return !isNaN(viewHeight) && isFinite(viewHeight) && viewHeight - scroll < threshold;
}

export function splitIntoGroups<T>(objects: {height: number, object: T}[], numberOfGroups: number): Column<T>[] {
	const columns: Column<T>[] = [...Array(numberOfGroups)].map((_, index) => ({
		things: [],
		length: 0,
		index
	}));

	for (const object of objects) {
		columns[0].things.push(object.object);
		columns[0].length += object.height;
		columns.sort((a, b) => a.length - b.length);
	}

	columns.sort((a, b) => a.index - b.index);
	return columns;
}

export function ImageRack(props: { images: Image[]; onScrollThreshold?: (isPastThreshold: boolean) => void; }): JSX.Element {
	const { scrollY, scrollYProgress } = useViewportScroll();
	const { onScrollThreshold } = props;
	React.useEffect(() => {
		scrollYProgress.onChange(() => {
			const wasPastThreshold = testScrollThreshold(scrollY.getPrevious(), scrollYProgress.getPrevious(), 800);
			const isPastThreshold = testScrollThreshold(scrollY.get(), scrollYProgress.get(), 800);
			if (isPastThreshold !== wasPastThreshold && onScrollThreshold) {
				onScrollThreshold(isPastThreshold);
			}
		});
		return () => scrollYProgress.clearListeners();
	}, [scrollY, scrollYProgress, onScrollThreshold]);

	const imageColumns = splitIntoGroups(props.images.map(image => ({
		height: image.height,
		object: image
	})), 3);

	return <div className="d-flex">
		{imageColumns.map(column => {
			return <div className={styles.imageColumn} key={column.index}>
				{column.things.map(image =>
					<div key={image.id} className={`${column.index === 0 ? "" : "ml-3"} mb-3`}>
						<ImageDisplay image={image} />
					</div>
				)}
			</div>;
		})}
	</div>;
}
