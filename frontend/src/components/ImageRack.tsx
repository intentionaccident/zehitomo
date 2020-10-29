import * as React from "react";
import { useViewportScroll } from "framer-motion";
import { Image } from "src/State";
import { ImageDisplay } from "./ImageDisplay";

interface ImageColumn {
	images: Image[],
	length: number,
	index: number,
}

function testScrollThreshold(
	scroll: number,
	scrollProgress: number,
	threshold: number
): boolean {
	const viewHeight = scroll / scrollProgress;
	return !isNaN(viewHeight) && isFinite(viewHeight) && viewHeight - scroll < threshold;
}

export function ImageRack(props: { images: Image[]; onScrollThreshold?: (isPastThreshold: boolean) => void; }): JSX.Element {
	const { scrollY, scrollYProgress } = useViewportScroll();
	const { onScrollThreshold } = props;
	React.useEffect(() => {
		scrollYProgress.onChange(() => {
			const wasPastThreshold = testScrollThreshold(scrollY.getPrevious(), scrollYProgress.getPrevious(), 800);
			const isPastThreshold = testScrollThreshold(scrollY.get(), scrollYProgress.get(), 800);
			if (isPastThreshold !== wasPastThreshold) {
				onScrollThreshold(isPastThreshold);
			}
		});
		return () => scrollYProgress.clearListeners();
	}, [scrollY, scrollYProgress, onScrollThreshold]);

	const imageColumns: ImageColumn[] = [...Array(3)].map((_, index) => ({
		images: [],
		length: 0,
		index
	}));

	for (const image of props.images) {
		imageColumns[0].images.push(image);
		imageColumns[0].length += image.height;
		imageColumns.sort((a, b) => a.length - b.length);
	}

	imageColumns.sort((a, b) => a.index - b.index);

	return <div className="d-flex">
		{imageColumns.map(column => {
			return <div key={column.index}>{column.images.map(image => <ImageDisplay key={image.id} image={image} />)}</div>;
		})}
	</div>;
}
