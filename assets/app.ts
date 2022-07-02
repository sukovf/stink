import {Severity} from "./ts/Severity";
const $ = require('jquery');
require('./js/kit/mdb.pro');
require('./ts/LiveFormValidation');
import {StinkMap} from "./ts/StinkMap";
import {Process} from "./ts/Process";
import {Location} from "./ts/Location";

/**
 *
 */
$(function() {
	const reportFormValidator = $('form').liveValidate();
	const map = new StinkMap($('#map')[0]);
	new Severity();
	new Process(reportFormValidator);
	new Location(map, reportFormValidator);
});