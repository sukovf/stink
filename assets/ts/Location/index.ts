import TriggeredEvent = JQuery.TriggeredEvent;

const $ = require('jquery');
import {StinkMap} from "../StinkMap";

/**
 *
 */
export class Location
{
	map: StinkMap;

	/**
	 *
	 */
	constructor(map: StinkMap) {
		this.map = map;

		this.init();
	}

	/**
	 *
	 */
	private init = () => {
		$('#button-find-location').on('click', (event: TriggeredEvent) => {
			const button: JQuery = $(event.currentTarget);
			button.addClass('disabled').find('.spinner-border').removeClass('d-none');

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((pos: GeolocationPosition) => {
					const long: number = pos.coords.longitude;
					const lat: number = pos.coords.latitude;

					$('input[name="report_form[long]"]').val(long);
					$('input[name="report_form[lat]"]').val(lat);

					this.map.setMyMarkerLocation([long, lat]);

					button.removeClass('disabled').find('.spinner-border').addClass('d-none');
				}, (error: GeolocationPositionError) => {
					alert(error.message);

					button.removeClass('disabled').find('.spinner-border').addClass('d-none');
				});
			}
		});
	}
}