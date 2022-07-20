import jqXHR = JQuery.jqXHR;

const $ = require('jquery');
import TriggeredEvent = JQuery.TriggeredEvent;
import {StinkMap} from "../StinkMap";
import {Message} from "../Message";

/**
 *
 */
export class Overview
{
	private readonly map: StinkMap;

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
		$('#show-overview').on('click', (event: TriggeredEvent) => {
			const button: JQuery = $(event.currentTarget);
			button
				.addClass('disabled')
				.find('.spinner-border')
				.removeClass('d-none');

			$.ajax({
				url: this.map.getHeatmapUrl(),
				method: 'GET',
				data: {
					from: $('input[name="overview-from-date"]').val() + $('input[name="overview-from-time"]').val(),
					to: $('input[name="overview-to-date"]').val() + $('input[name="overview-to-time"]').val()
				}
			}).done((data: string) => {
				this.map.setHeatmapData(data);

				this.updateOverviewBar();
			}).always((data: any, textStatus: any, jqXHR: jqXHR) => {
				const modalObj = $('#reportsDownloadModal');

				if (jqXHR.status !== 200) {
					Message.show(
						modalObj.attr('data-error-title'),
						modalObj.attr('data-error-text')
					);
				}

				button
					.removeClass('disabled')
					.find('.spinner-border')
					.addClass('d-none');

				modalObj.modal('hide');
			});
		});

		$('.overview-bar > .content > .btn-close').on('click', (event: TriggeredEvent) => {
			this.map.resetHeatmapData();

			$(event.currentTarget)
				.closest('.overview-bar')
				.addClass('hidden');
		});
	}

	/**
	 *
	 */
	private updateOverviewBar = () => {
		const fromDate: string = $('input[name="overview-from-date"]').val();
		const fromTime: string = $('input[name="overview-from-time"]').val();
		const toDate: string = $('input[name="overview-to-date"]').val();
		const toTime: string = $('input[name="overview-to-time"]').val();

		if ((!fromDate || fromDate === '') && (!toDate || toDate === '')) {
			$('.overview-bar').addClass('hidden');
			return;
		}

		const modal: JQuery = $('#reportsDownloadModal');

		let content: string = modal.attr('data-overview-bar-from') +
			' <span class="text-danger">' + fromDate + (fromTime ? (' ' + fromTime) : '') + '</span>';
		if (toDate) {
			content += ' ' + modal.attr('data-overview-bar-to') +
				' <span class="text-danger">' + toDate + (toTime ? (' ' + toTime) : '') + '</span>';
		}

		$('.overview-bar > .content > span').html(content);

		$('.overview-bar').removeClass('hidden');
	}
}