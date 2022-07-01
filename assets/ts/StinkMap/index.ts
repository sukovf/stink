const $ = require('jquery');
import {LngLat, LngLatLike, Map, MapMouseEvent, Marker} from "mapbox-gl";

/**
 *
 */
export class StinkMap
{
	mapContainer: HTMLElement;
	map: Map;
	marker: Marker;

	/**
	 *
	 */
	constructor(mapContainer: HTMLElement) {
		this.mapContainer = mapContainer;
		this.marker = new Marker();

		this.init();
	}

	/**
	 *
	 */
	public setMyMarkerLocation = (coords: LngLatLike) => {
		this.marker.setLngLat(coords);
		this.map.panTo(coords);
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
		}).on('click', (event: MapMouseEvent) => {
			const coords: LngLat = event.lngLat;
			this.marker.setLngLat(coords);

			$('input[name="report_form[long]"]').val(coords.lng);
			$('input[name="report_form[lat]"]').val(coords.lat);
		});

		this.marker.setLngLat([0, 0]).addTo(this.map);
	}
}