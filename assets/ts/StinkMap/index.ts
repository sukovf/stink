import {Map} from "mapbox-gl";

/**
 *
 */
export class StinkMap
{
	mapContainer: HTMLElement;
	map: Map;

	/**
	 *
	 */
	constructor(mapContainer: HTMLElement) {
		this.mapContainer = mapContainer;

		this.init();
	}

	/**
	 *
	 */
	private init = () => {
		const token: string = this.mapContainer.getAttribute('data-token');
		this.mapContainer.removeAttribute('data-token');

		this.map = new Map({
			accessToken: token,
			container: this.mapContainer,
			style: 'mapbox://styles/sukovf/cl5152acy000z15pf1cd2g437',
			bounds: [
				[16.6221328, 49.1559033],
				[16.7409225, 49.2360533]
			],
			projection: {
				name: 'mercator'
			}
		});
	}
}