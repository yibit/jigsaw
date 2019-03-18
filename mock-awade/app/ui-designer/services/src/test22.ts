
import * as marked from "marked";
import {calc} from "./lib/calc";
import {complexCalc} from "./lib/complex-calc";
import {add} from "./lib/add";
import {add as add1} from "./lib/add";

const md = marked(`[3333333333333333](bbbbbbbbbbbbbbbb)`);
console.log(md);

const n1 = calc(40,30,20,10);
const n2 = complexCalc(4,3,2,1);
console.log(add(n1, n2));

export const bb = 'ffffffffffffffffffff';
console.log(bb);
console.log(bb);
console.log(bb);
console.log(bb);
