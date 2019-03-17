import {add} from "./add";
import {minus} from "./minus";
import {calc} from "./calc";

export function complexCalc(n1, n2, n3, n4) {
    return add(n1, n2) + minus(n3, n4) + calc(4,3,2,1);
}
