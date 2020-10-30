export interface Image {
	id: string;
	width: number;
	height: number;
	color: string;
	urls: {
		small: string;
	}
	links: {
		download: string;
	}
	user: {
		username: string;
		name: string;
		links: {
			html: string;
		}
	}
}

export interface ImageGroup {
	imageIds?: string[];
	name: string;
	description: string;
	id: string;
}

export interface State {
	images: Record<string, Image>;
	imageGroups: ImageGroup[];
}
