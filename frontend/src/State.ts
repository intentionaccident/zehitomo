export interface Image {
	id: string;
	height: number;
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
	id: string;
}

export interface State {
	images: Record<string, Image>;
	imageGroups: ImageGroup[];
}
