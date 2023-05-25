import * as $ from 'jquery';
import Datepicker from './../../js/kit/pro/datepicker';

/**
 *
 */
$(function() {
	const locale: JQuery = $('#datepicker-locale');

	const options = {
		format: locale.attr('data-date-format'),
		title: locale.attr('data-title'),
		monthsFull: [
			locale.attr('data-january-full'),
			locale.attr('data-february-full'),
			locale.attr('data-march-full'),
			locale.attr('data-april-full'),
			locale.attr('data-may-full'),
			locale.attr('data-june-full'),
			locale.attr('data-july-full'),
			locale.attr('data-august-full'),
			locale.attr('data-september-full'),
			locale.attr('data-october-full'),
			locale.attr('data-november-full'),
			locale.attr('data-december-full')
		],
		monthsShort: [
			locale.attr('data-january-short'),
			locale.attr('data-february-short'),
			locale.attr('data-march-short'),
			locale.attr('data-april-short'),
			locale.attr('data-may-short'),
			locale.attr('data-june-short'),
			locale.attr('data-july-short'),
			locale.attr('data-august-short'),
			locale.attr('data-september-short'),
			locale.attr('data-october-short'),
			locale.attr('data-november-short'),
			locale.attr('data-december-short')
		],
		weekdaysFull: [
			locale.attr('data-monday-full'),
			locale.attr('data-tuesday-full'),
			locale.attr('data-wednesday-full'),
			locale.attr('data-thursday-full'),
			locale.attr('data-friday-full'),
			locale.attr('data-saturday-full'),
			locale.attr('data-sunday-full')
		],
		weekdaysShort: [
			locale.attr('data-monday-short'),
			locale.attr('data-tuesday-short'),
			locale.attr('data-wednesday-short'),
			locale.attr('data-thursday-short'),
			locale.attr('data-friday-short'),
			locale.attr('data-saturday-short'),
			locale.attr('data-sunday-short')
		],
		weekdaysNarrow: [
			locale.attr('data-monday-narrow'),
			locale.attr('data-tuesday-narrow'),
			locale.attr('data-wednesday-narrow'),
			locale.attr('data-thursday-narrow'),
			locale.attr('data-friday-narrow'),
			locale.attr('data-saturday-narrow'),
			locale.attr('data-sunday-narrow')
		],
		okBtnText: locale.attr('data-button-ok'),
		cancelBtnText: locale.attr('data-button-cancel'),
		clearBtnText: locale.attr('data-button-clear'),
		okBtnLabel: locale.attr('data-label-ok'),
		cancelBtnLabel: locale.attr('data-label-cancel'),
		clearBtnLabel: locale.attr('data-label-clear'),
		nextMonthLabel: locale.attr('data-label-next-month'),
		prevMonthLabel: locale.attr('data-label-prev-month'),
		nextYearLabel: locale.attr('data-label-next-year'),
		prevYearLabel: locale.attr('data-label-prev-year'),
		nextMultiYearLabel: locale.attr('data-label-next-multiyear'),
		prevMultiYearLabel: locale.attr('data-label-prev-multiyear'),
		switchToMultiYearViewLabel: locale.attr('data-label-multiyear-view'),
		switchToMonthViewLabel: locale.attr('data-label-month-view'),
		switchToDayViewLabel: locale.attr('data-label-day-view')
	};

	$.each($('.datepicker'), (index: number, datepicker: HTMLElement) => {
		new Datepicker(datepicker, options);
	});
});