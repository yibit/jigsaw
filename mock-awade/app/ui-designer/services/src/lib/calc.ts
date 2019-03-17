import {add} from "./add";
import {minus} from "./minus";

export function calc(n1, n2, n3, n4) {
    return add(n1, n2) + minus(n3, n4);
}