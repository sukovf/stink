const $ = require('jquery');
import {LiveValidationResult, LiveValidationRule} from './classes';
import TriggeredEvent = JQuery.TriggeredEvent;

/**
 *
 */
$.fn.liveValidate = function(): JQuery {
	return this.each((formIndex: number, form: HTMLElement) => {
		let result: LiveValidationResult = new LiveValidationResult(form);

		$('input, select', form).on('keyup paste blur change', (event: TriggeredEvent) => {
			if (!$(event.currentTarget).hasClass('is-invalid') &&
				event.type === 'keyup' ||
				isSpecialKey(event.which)) {
				return false;
			}

			validateElements(form, event.currentTarget);
			showErrors(form);
		});

		$(form).on('submit', () => {
			validateElements(form);
			if (!result.isValid()) {
				showErrors(form);
				focusFirstInputWithError(result);
				return false;
			}
		});

		/**
		 *
		 */
		const isSpecialKey = (key: number): boolean => {
			return (key == 20 || /* Caps lock */
				key == 16 || /* Shift */
				key == 9 || /* Tab */
				key == 27 || /* Escape Key */
				key == 17 || /* Control Key */
				key == 91 || /* Windows Command Key */
				key == 19 || /* Pause Break */
				key == 18 || /* Alt Key */
				key == 93 || /* Right Click Point Key */
				(key >= 35 && key <= 40) || /* Home, End, Arrow Keys */
				key == 45 || /* Insert Key */
				(key >= 33 && key <= 34) || /*Page Down, Page Up */
				(key >= 112 && key <= 123) || /* F1 - F12 */
				(key >= 144 && key <= 145)); /* Num Lock, Scroll Lock */
		}

		/**
		 *
		 */
		const validateElements = (form: HTMLElement, element: HTMLElement | null = null) => {
			const elements: HTMLElement[] = element === null ? $('input, select', form).toArray() : [element];

			elements.forEach((input: HTMLElement) => {
				const inputName: string | undefined = $(input).attr('name');
				if (typeof inputName === 'undefined') {
					return;
				}

				result.clearInputErrors(inputName);

				const validationRules: string | undefined = $(input).attr('data-validation-rules');
				if (typeof validationRules === 'undefined' || !validationRules) {
					return;
				}

				const rules: object[] | null = JSON.parse(validationRules);
				if (!rules || !rules.length) {
					return;
				}

				$.each(rules, (ruleIndex: number, ruleData: object) => {
					const rule: LiveValidationRule = Object.assign(new LiveValidationRule(), ruleData);
					if (typeof LiveValidators[rule.op] === 'undefined') {
						return;
					}

					if (!LiveValidators[rule.op](rule.args, $(input).val())) {
						result.addError(inputName, rule.msg);
					}
				});
			});
		};

		/**
		 *
		 */
		const showErrors = (form: HTMLElement) => {
			// remove existing error messages
			$('input, select', form).removeClass('is-invalid');
			$('.invalid-feedback', form).remove();

			if (result.isValid()) {
				return;
			}

			$.each(Object.keys(result.getErrors()), (keyIndex: number, key: string) => {
				const input: JQuery = $('[name="' + key + '"]', form);

				if (input[0].nodeName === 'SELECT') {
					input
						.closest('.select-wrapper')
						.find('input.select-input')
						.addClass('is-invalid');
				} else {
					input.addClass('is-invalid');
				}

				const errorsList: JQuery = $('<div>')
					.addClass('invalid-feedback d-block position-relative mb-3');

				const errors: string[] = result.getErrors()[key];
				$.each(errors, (errorIndex: number, error: string) => {
					errorsList.append(error);

					if (errorIndex < errors.length - 1) {
						errorsList.append('<br>');
					}
				});

				input
					.parents('.form-widget-wrapper')
					.after(errorsList);
			});
		};

		/**
		 *
		 */
		const focusFirstInputWithError = (result: LiveValidationResult) => {
			const input: JQuery | null = result.getFirstInputWithError();

			if (input !== null) {
				input.trigger('focus');
			}
		};

		/**
		 */
		this.validateCustomElements = (elements: JQuery): boolean => {
			let foundError: boolean = false;

			$.each(elements, (index: number, element: HTMLElement) => {
				validateElements(form, element);
				if (!result.isValid()) {
					showErrors(form);
					focusFirstInputWithError(result);

					foundError = true;
				}
			});

			return !foundError;
		}
	});
};

export let LiveValidators: {[key: string]: (args: string|string[]|number, value: string|string[]|number) => boolean} = {};

LiveValidators['MIN_LENGTH'] = (args: string|string[]|number, value: string|string[]|number) => {
	if (!value) {
		return true;
	}

	return typeof value === 'string' &&
		typeof args === 'number' &&
		String(value).length >= args;
};

LiveValidators['MAX_LENGTH'] = (args: string|string[]|number, value: string|string[]|number) => {
	return typeof value === 'string' &&
		typeof args === 'number' &&
		String(value).length <= args;
};

LiveValidators['GREATER_THAN'] = (args: string|string[]|number, value: string|string[]|number) => {
	return typeof value === 'string' &&
		typeof args === 'number' &&
		parseFloat(value) > args;
};

LiveValidators['LESS_THAN'] = (args: string|string[]|number, value: string|string[]|number) => {
	return typeof value === 'string' &&
		typeof args === 'number' &&
		parseFloat(value) < args;
};

LiveValidators['RANGE'] = (args: string|string[]|number, value: string|string[]|number) => {
	return Array.isArray(args) && args.length === 2 && typeof value === 'string' &&
		parseFloat(value) > parseFloat(args[0]) && parseFloat(value) < parseFloat(args[1]);
};

LiveValidators['EMAIL'] = (args: string|string[]|number, value: string|string[]|number) => {
	if (typeof value !== 'string') {
		return false;
	}

	return !!value.match(/^[a-zA-Z\d.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?(?:\.[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?)+$/);
};

LiveValidators['NOT_BLANK'] = (args: string|string[]|number, value: string|string[]|number) => {
	if (typeof value === 'number') {
		return true;
	}

	if (Array.isArray(value)) {
		return false;
	}

	return !(typeof value === 'undefined' || !value || !!value.match(/^\s*$/mg));
};