import $ = require('jquery');

export class LiveValidationRule
{
	op: string;
	args: string|string[]|number;
	msg: string;

	constructor(op: string = '', args: string|string[]|number = '', msg: string = '')
	{
		this.op = op;
		this.args = args;
		this.msg = msg;
	}
}

export class LiveValidationResult
{
	form: HTMLElement;
	errors: {[key: string]: string[]}

	constructor(form: HTMLElement)
	{
		this.form = form;
		this.errors = {};
	}

	addError(inputName: string, message: string)
	{
		if (typeof this.errors[inputName] === 'undefined') {
			this.errors[inputName] = [message];
		} else {
			this.errors[inputName].push(message);
		}
	}

	clearInputErrors(inputName: string)
	{
		delete this.errors[inputName];
	}

	getErrors(): {[key: string]: string[]}
	{
		return this.errors;
	}

	isValid(): boolean
	{
		return !Object.keys(this.errors).length;
	}

	getFirstInputWithError(): JQuery|null
	{
		if (this.isValid()) {
			return null;
		}

		return $('[name="' + Object.keys(this.errors)[0] + '"]', this.form);
	}
}