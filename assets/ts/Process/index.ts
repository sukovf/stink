import TriggeredEvent = JQuery.TriggeredEvent;
import Select from './../../js/kit/pro/select';
const $ = require('jquery');

/**
 *
 */
enum Section {
	Default = 0,
	Severity = 1,
	Details = 2,
	Location = 3
}

/**
 *
 */
export class Process
{
	section: Section;
	severity: number;
	reportFormValidator: any;
	continueReportLabel: string;

	/**
	 *
	 */
	constructor(reportFormValidator: any) {
		this.section = Section.Default;
		this.severity = 0;
		this.reportFormValidator = reportFormValidator;

		this.init();
		this.readMessages();
	}

	/**
	 *
	 */
	private init = () => {
		$('.body-back').on('click', () => {
			if (this.section === Section.Details) {
				this.toggleCardBody('#body-severity', true);
				this.toggleCardBody('#body-report-form', false);

				this.section = Section.Severity;
			} else if (this.section === Section.Location) {
				this.toggleCardBody('#body-report-form', true);
				this.toggleCardBody('#body-location', false);

				this.section = Section.Details;
			}
		});

		$('.body-close').on('click', () => {
			this.toggleCardBody('#body-default', true);
			this.toggleCardBody('#body-severity', false);
			this.toggleCardBody('#body-report-form', false);
			this.toggleCardBody('#body-location', false);
		});

		const shouldFirstFormBeVisible: boolean = typeof $('#body-report-form').attr('data-is-visible') !== 'undefined';
		const shouldSecondFormBeVisible: boolean = typeof $('#body-location').attr('data-is-visible') !== 'undefined';

		if (!shouldFirstFormBeVisible && !shouldSecondFormBeVisible) {
			this.toggleCardBody('#body-default', true, 250);
		} else if (shouldFirstFormBeVisible) {
			this.toggleCardBody('#body-report-form', true, 250);
		} else if (shouldSecondFormBeVisible) {
			this.toggleCardBody('#body-location', true, 250);
		}

		$('#button-new-report').on('click', () => {
			if (this.section === Section.Details) {
				this.toggleCardBody('#body-report-form', true);
				this.toggleCardBody('#body-default', false);
			} else if (this.section === Section.Location) {
				this.toggleCardBody('#body-location', true);
				this.toggleCardBody('#body-default', false);
			} else {
				this.toggleCardBody('#body-severity', true);
				this.toggleCardBody('#body-default', false);

				this.section = Section.Severity;
			}
		});

		$('.severity').on('click', (event: TriggeredEvent) => {
			this.severity = event.currentTarget.getAttribute('data-id');
			Select.getInstance($('select[name="form[severity]"]')[0]).setValue(this.severity);

			this.toggleCardBody('#body-report-form', true);
			this.toggleCardBody('#body-severity', false);

			$('#button-new-report').text(this.continueReportLabel);

			this.section = Section.Details;
		});

		$('#button-pick-location').on('click', () => {
			if (!this.reportFormValidator.validateCustomElements([
				$('select[name="form[severity]"]'),
				$('input[name="form[reporterName]"]'),
				$('input[name="form[reporterSurname]"]'),
				$('input[name="form[reporterEmail]"]')
			])) {
				return false;
			}

			this.toggleCardBody('#body-location', true);
			this.toggleCardBody('#body-report-form', false);

			this.section = Section.Location;
		});
	}

	/**
	 *
	 */
	private toggleCardBody(cardID: string, open: boolean, delay: number = 0) {
		setTimeout(() => {
			if (open) {
				$(cardID).slideDown({
					direction: 'up'
				}, 250);
			} else {
				$(cardID).slideUp({
					direction: 'up'
				}, 250);
			}
		}, delay);
	}

	/**
	 *
	 */
	private readMessages = () => {
		this.continueReportLabel = $('#body-default').attr('data-continue-report');
	}
}