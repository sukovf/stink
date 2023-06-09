const $ = require('jquery');
import {GeoJSONSource, LngLat, LngLatLike, Map, MapMouseEvent, Marker} from 'mapbox-gl';
import jqXHR = JQuery.jqXHR;
import {Message} from '../Message';

export class StinkMap
{
	mapContainer: HTMLElement;
	map: Map;
	marker: Marker;
	dataErrorTitle: string;
	dataErrorText: string;
	dataLoadedCallback: (isInitial: boolean, fromDate: string|null, toDate: string|null) => void|null;

	constructor(mapContainer: HTMLElement) {
		this.mapContainer = mapContainer;
		this.marker = new Marker();

		this.init();
	}

	public setOnDataLoaded = (callback: (isInitial: boolean, fromDate: string|null, toDate: string|null) => void) => {
		this.dataLoadedCallback = callback;
	}

	public setMyMarkerLocation = (coords: LngLatLike) => {
		this.marker.setLngLat(coords);
		this.map.panTo(coords);
	}

	public getHeatmapUrl = (): string => {
		return this.mapContainer.getAttribute('data-heatmap-data-url');
	}

	private loadHeatmapData = (isInitial: boolean = false, from: string|null = null, to: string|null = null) => {
		$('#map-spinner-container').removeClass('d-none');

		$.ajax({
			url: this.getHeatmapUrl(),
			method: 'GET',
			data: {
				from: from,
				to: to
			}
		}).done((data: any) => {
			const source: GeoJSONSource = this.map.getSource('reports') as GeoJSONSource;
			source.setData(data.data);

			if (this.dataLoadedCallback) {
				this.dataLoadedCallback(isInitial, data.fromDate, data.toDate);
			}
		}).always((data: any, textStatus: any, jqXHR: jqXHR) => {
			if (jqXHR.status !== 200) {
				Message.show(this.dataErrorTitle, this.dataErrorText);
			}

			$('#map-spinner-container').addClass('d-none');
		});
	}

	public setHeatmapData = (isInitial: boolean = false, from: string|null = null, to: string|null = null) => {
		this.loadHeatmapData(isInitial, from, to);
	}

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

		this.dataErrorTitle = this.mapContainer.getAttribute('data-error-title');
		this.dataErrorText = this.mapContainer.getAttribute('data-error-text');

		this.map = new Map({
			accessToken: token,
			container: this.mapContainer,
			style: 'mapbox://styles/sukovf/cl5152acy000z15pf1cd2g437',
			pitchWithRotate: false,
			touchPitch: false,
			dragRotate: false,
			doubleClickZoom: true,
			minZoom: 10,
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
			// reports data source
			this.map.addSource('reports', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});

			this.setHeatmapData(true);

			// bounds data source
			this.map.addSource('bounds', {
				type: 'geojson',
				data: {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'MultiPolygon',
						coordinates: [
							[
								[
									[-180, -90,],
									[westernLimit, southernLimit],
									[easternLimit, southernLimit],
									[180, -90],
									[-180, -90]
								]
							], [
								[
									[-180, 90],
									[westernLimit, northernLimit],
									[westernLimit, southernLimit],
									[-180, -90],
									[-180, 90]
								]
							], [
								[
									[-180, 90],
									[180, 90],
									[easternLimit, northernLimit],
									[westernLimit, northernLimit],
									[-180, 90]
								]
							], [
								[
									[180, 90],
									[easternLimit, northernLimit],
									[easternLimit, southernLimit],
									[180, -90],
									[180, 90]
								]
							]
						]
					}
				}
			});

			// reports heatmap layer
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

			// bounds layer
			this.map.addLayer({
				id: 'bounds',
				source: 'bounds',
				type: 'fill',
				layout: {},
				paint: {
					'fill-color': '#f93154',
					'fill-opacity': 0.08,
					'fill-antialias': false
				}
			})
		});

		this.marker.setLngLat([0, 0]).addTo(this.map);
	}
}