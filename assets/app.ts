import * as $ from 'jquery';
import {Severity} from './ts/Severity';
import {StinkMap} from './ts/StinkMap';
import {Process} from './ts/Process';
import {Location} from './ts/Location';
import {Overview} from './ts/Overview';
require('./js/kit/mdb.pro');
require('./ts/Components/datepicker-locale');
require('./ts/Components/timepicker-locale');
require('./ts/LiveFormValidation');
require('./ts/Recaptcha/index');

$(function() {
	const reportFormValidator = $('form').liveValidate();
	const map = new StinkMap($('#map')[0]);
	new Severity();
	new Process(reportFormValidator);
	new Location(map, reportFormValidator);
	new Overview(map);
});