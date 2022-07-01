import {Severity} from "./ts/Severity";
const $ = require('jquery');
require('mdb-ui-kit/js/mdb.min');
require('./js/components/components');
import {StinkMap} from "./ts/StinkMap";
import {Process} from "./ts/Process";
import {Location} from "./ts/Location";

/**
 *
 */
$(function() {
	const map = new StinkMap($('#map')[0]);
	new Severity();
	new Process();
	new Location(map);
});