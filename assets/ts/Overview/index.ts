const $ = require('jquery');
import TriggeredEvent = JQuery.TriggeredEvent;
import {StinkMap} from '../StinkMap';

export class Overview
{
	private readonly map: StinkMap;

	constructor(map: StinkMap) {
		this.map = map;

		this.init();
	}

	private init = () => {
		this.map.setOnDataLoaded((isInitial: boolean, fromDate: string|null, toDate: string|null) => {
			this.updateOverviewBar(isInitial, fromDate, toDate);
		});

		$('#show-overview').on('click', () => {
			this.map.setHeatmapData(
				false,
				$('input[name="overview-from-date"]').val() + $('input[name="overview-from-time"]').val(),
				$('input[name="overview-to-date"]').val() + $('input[name="overview-to-time"]').val()
			);

			$('#reportsDownloadModal').modal('hide');
		});

		$('.overview-bar > .content > .btn-close').on('click', (event: TriggeredEvent) => {
			const closeButton = $(event.currentTarget);
			if (closeButton.hasClass('hidden')) {
				return;
			}

			this.map.setHeatmapData(true);

			closeButton.addClass('hidden');

			$('input[name="overview-from-date"]').val(null);
			$('input[name="overview-from-time"]').val(null);
			$('input[name="overview-to-date"]').val(null);
			$('input[name="overview-to-time"]').val(null);
		});
	}

	private updateOverviewBar = (isInitial: boolean, fromDate: string, toDate: string) => {
		const modal: JQuery = $('#reportsDownloadModal');
		const fromText: string = modal.attr('data-overview-bar-from');
		const toText: string = modal.attr('data-overview-bar-to');

		let content =
			(fromDate.length > 0 ? fromText : '') +
			(fromDate.length > 0 ? ' <span class="text-danger">' + fromDate + '</span>' : '') +
			(toDate.length > 0 ? (fromDate.length > 0 ? ' ' : '') + toText : '') +
			(toDate.length > 0 ? ' <span class="text-danger">' + toDate + '</span>' : '');

		$('.overview-bar > .content > span').html(content);

		if (!isInitial) {
			$('.overview-bar > .content > .btn-close').removeClass('hidden');
		}
	}
}