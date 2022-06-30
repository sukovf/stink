const $ = require('jquery');
require('mdb-ui-kit/js/mdb.min');
import {StinkMap} from "./ts/StinkMap";

$(function() {
	new StinkMap($('#map')[0]);
});