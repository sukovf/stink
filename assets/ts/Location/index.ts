import TriggeredEvent = JQuery.TriggeredEvent;
const $ = require('jquery');
import {StinkMap} from '../StinkMap';

/**
 *
 */
export class Location
{
	map: StinkMap;
	reportFormValidator: any;
	locationDeniedHeader: string;
	locationDeniedMsg: string;
	locationUnavailableHeader: string;
	locationUnavailableMsg: string;
	locationTimeoutHeader: string;
	locationTimeoutMsg: string;

	/**
	 *
	 */
	constructor(map: StinkMap, reportFormValidator: any) {
		this.map = map;
		this.reportFormValidator = reportFormValidator;

		this.readMessages();
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
					switch (error.code) {
						case error.PERMISSION_DENIED:
							this.setModalMessage(this.locationDeniedHeader, this.locationDeniedMsg);
							break;

						case error.POSITION_UNAVAILABLE:
							this.setModalMessage(this.locationUnavailableHeader, this.locationUnavailableMsg);
							break;

						case error.TIMEOUT:
							this.setModalMessage(this.locationTimeoutHeader, this.locationTimeoutMsg);
							break;
					}

					if (typeof error.code === 'number') {
						$('#messageModal').modal('show');
					}

					button.removeClass('disabled').find('.spinner-border').addClass('d-none');
				});
			}
		});
	}

	/**
	 *
	 */
	private readMessages = () => {
		const msgContainer: JQuery = $('#body-location');
		this.locationDeniedHeader = msgContainer.attr('data-msg-location-denied-header');
		this.locationDeniedMsg = msgContainer.attr('data-msg-location-denied-msg');
		this.locationUnavailableHeader = msgContainer.attr('data-msg-location-unavailable-header');
		this.locationUnavailableMsg = msgContainer.attr('data-msg-location-unavailable-msg');
		this.locationTimeoutHeader = msgContainer.attr('data-msg-location-timeout-header');
		this.locationTimeoutMsg = msgContainer.attr('data-msg-location-timeout-msg');
	}

	/**
	 *
	 */
	private setModalMessage = (title: string, msg: string) => {
		$('#messageModal .modal-title').html(title);
		$('#messageModal .modal-body').html(msg);
	}
}