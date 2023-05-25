import * as $ from 'jquery';
import Timepicker from './../../js/kit/pro/timepicker';

$(function() {
	const locale: JQuery = $('#timepicker-locale');

	const options = {
		okLabel: locale.attr('data-label-ok'),
		cancelLabel: locale.attr('data-label-cancel'),
		clearLabel: locale.attr('data-label-clear'),
		invalidLabel: locale.attr('data-label-invalid'),
		format24: true
	};

	$.each($('.timepicker'), (index: number, timepicker: HTMLElement) => {
		new Timepicker(timepicker, options);
	});
});