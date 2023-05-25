import * as $ from 'jquery';

window.onGoogleReCaptchaApiLoad = () => {
	$.each($('[data-toggle="recaptcha"]'), (rcIndex: number, element: HTMLElement) => {
		const form: JQuery = $(element).closest('form');

		let params: {[key: string]: any} = {
			sitekey: '6Lcw37wgAAAAACPhjlXUElZlgUuFiE6_cygtkrM7',
			callback: () => {
				$('button[type="submit"]', form).attr('data-recaptcha-valid', '1');
				form.trigger('submit');
			},
			size: 'invisible',
			badge: 'inline',
			theme: 'dark'
		};

		const widgetID: number = grecaptcha.render(element, params);

		$.each($('button[type="submit"]', form), (buttonIndex: number, button: HTMLElement) => {
			$(button).on('click', (event) => {
				if ($(button).attr('data-recaptcha-valid') !== '1') {
					event.preventDefault();
					grecaptcha.execute(widgetID);
				}
			});
		});
	});
}