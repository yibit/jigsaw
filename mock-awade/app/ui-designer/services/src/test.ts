import * as marked from "marked";
import {calc} from "./lib/calc";
import {complexCalc} from "./lib/complex-calc";
import {add as add1} from "./lib/add";
import {log} from "./utils/log";
import {basic} from "@awade/basics";

var data = require('./xx.json');

const md = marked(`[fffffff](222222)`);
log(md);

const r = add1(1,2);
console.log(r);
const n1 = calc(40,30,20,10);
const n2 = complexCalc(4,3,2,1);
console.log(n1, n2);

export const aa = 'ffffffffffffff.fffd';
console.log(aa);
basic('fsf');
// console.log(Component);