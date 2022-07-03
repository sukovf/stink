const $ = require('jquery');

/**
 *
 */
export class Severity
{
	/**
	 *
	 */
	constructor() {
		$.each($('.severity > .stripe'), (index: number, severityStripe: HTMLElement) => {
			severityStripe.style.backgroundColor = $(severityStripe).parent().attr('data-color');
		});
	}
}