import * as jQuery from 'jquery';
import createPow from './pow';

const jq = jQuery.noConflict();
jq.fn.pow = createPow(jq);

export default jq;
