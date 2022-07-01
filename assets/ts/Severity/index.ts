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
		$.each($('.severity'), (index: number, severity: HTMLElement) => {
			severity.style.backgroundColor = severity.getAttribute('data-color');
		});
	}
}