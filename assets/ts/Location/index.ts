import TriggeredEvent = JQuery.TriggeredEvent;
const $ = require('jquery');
import {StinkMap} from "../StinkMap";

/**
 *
 */
export class Location
{
	map: StinkMap;
	reportFormValidator: any;

	/**
	 *
	 */
	constructor(map: StinkMap, reportFormValidator: any) {
		this.map = map;
		this.reportFormValidator = reportFormValidator;

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

					const inputLong: JQuery = $('input[name="form[longitude]"]');
					const inputLat = $('input[name="form[latitude]"]');

					inputLong.val(long).trigger('change');
					inputLat.val(lat).trigger('change');

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