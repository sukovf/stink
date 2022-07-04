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
		this.mapContainer.removeAttribute('data-token')

		const westernLimit: number = parseFloat(this.mapContainer.getAttribute('data-western-limit'));
		this.mapContainer.removeAttribute('data-western-limit');
		const northernLimit: number = parseFloat(this.mapContainer.getAttribute('data-northern-limit'));
		this.mapContainer.removeAttribute('data-northern-limit');
		const easternLimit: number = parseFloat(this.mapContainer.getAttribute('data-eastern-limit'));
		this.mapContainer.removeAttribute('data-eastern-limit');
		const southernLimit: number = parseFloat(this.mapContainer.getAttribute('data-southern-limit'));
		this.mapContainer.removeAttribute('data-southern-limit');

		const heatmapDataURL: string = this.mapContainer.getAttribute('data-heatmap-data-url');

		this.map = new Map({
			accessToken: token,
			container: this.mapContainer,
			style: 'mapbox://styles/sukovf/cl5152acy000z15pf1cd2g437',
			bounds: [
				[westernLimit, southernLimit],
				[easternLimit, northernLimit]
			],
			projection: {
				name: 'mercator'
			}
		}).on('click', (event: MapMouseEvent) => {
			const coords: LngLat = event.lngLat;
			this.marker.setLngLat(coords);

			$('input[name="form[longitude]"]').val(coords.lng).trigger('change');
			$('input[name="form[latitude]"]').val(coords.lat).trigger('change');
		}).on('load', () => {
			this.map.addSource('reports', {
				type: 'geojson',
				data: heatmapDataURL
			});

			this.map.addLayer({
				type: 'heatmap',
				id: 'reports-heat',
				source: 'reports',
				paint: {
					'heatmap-weight': [
						'interpolate',
						['linear'],
						['get', 'size'],
						0,
						0,
						6,
						1
					],
					'heatmap-intensity': [
						'interpolate',
						['linear'],
						['zoom'],
						0,
						1,
						9,
						3
					],
					'heatmap-color': [
						'interpolate',
						['linear'],
						['heatmap-density'],
						0, 'rgba(76, 175, 80, 0)',
						0.2, '#6EBA40',
						0.4, '#A6C633',
						0.6, '#D1B024',
						0.8, '#DD6413',
						1, '#E90004'
					],
					'heatmap-opacity': 0.2
				}
			});
		});

		this.marker.setLngLat([0, 0]).addTo(this.map);
	}
}