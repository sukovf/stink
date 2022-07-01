import TriggeredEvent = JQuery.TriggeredEvent;
import Select from './../../js/components/select';
const $ = require('jquery');

/**
 *
 */
export class Process
{
	severity: number;

	/**
	 *
	 */
	constructor() {
		this.severity = 0;

		this.init();
	}

	/**
	 *
	 */
	private init = () => {
		this.toggleCardBody('#body-default', true, 250);

		$('#button-new-report').on('click', () => {
			this.toggleCardBody('#body-severity', true);
			this.toggleCardBody('#body-default', false);
		});

		$('.severity').on('click', (event: TriggeredEvent) => {
			this.severity = event.currentTarget.getAttribute('data-id');
			Select.getInstance($('select[name="report_form[severity]"]')[0]).setValue(this.severity);

			this.toggleCardBody('#body-report-form', true);
			this.toggleCardBody('#body-severity', false);
		});

		$('#button-pick-location').on('click', () => {
			this.toggleCardBody('#body-location', true);
			this.toggleCardBody('#body-report-form', false);
		});
	}

	/**
	 *
	 */
	private toggleCardBody(cardID: string, open: boolean, delay: number = 0) {
		setTimeout(() => {
			$(cardID).slideToggle({
				direction: open ? 'up' : 'down'
			}, 250);
		}, delay);
	}
}