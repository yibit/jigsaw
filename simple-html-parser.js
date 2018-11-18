
let input= `<!-- ignore the following lines, they are not important to this demo -->

<input =b123      a1 = bbb a2 a3 = "dd'dd" a4="ff>ff" =fdfd a5=true a6="ss\\"32" =>
<!-- ignore the following lines, they are not important to this demo -->
<jigsaw-demo-description [summary]="summary" [content]="description">
</jigsaw-demo-description>


<!-- start to learn the demo from here -->
<div class="container">
    <jigsaw-tabs (selectChange)="testEvent($event)" (selectedIndexChange)="selectedIndexChange($event)" [selectedIndex]="2" height="200">
        <jigsaw-tab-pane [lazy]="false">
            <div jigsaw-title><span class="fa fa-gift"></span>tab 1</div>
            <ng-template>tab content 1</ng-template>
        </jigsaw-tab-pane>
        <jigsaw-tab-pane>
            <div jigsaw-title>
                <span>tab <jigsaw-button [preSize]="'small'">ok</jigsaw-button></span>
            </div>
            <ng-template>
                <div class="content-box">
                    <h3 class="content-title">user register center</h3>
                    <div class="content-line">
                        <label>Username: </label>
                        <jigsaw-input></jigsaw-input>
                    </div>
                    <div class="content-line">
                        <label>Email: </label>
                        <jigsaw-input></jigsaw-input>
                    </div>
                    <div class="content-line">
                        <label>Password: </label>
                        <jigsaw-input></jigsaw-input>
                    </div>
                    <jigsaw-button>submit</jigsaw-button>
                </div>
            </ng-template>
        </jigsaw-tab-pane>
        <jigsaw-tab-pane title="tab 3">
            <ng-template>tab content 3</ng-template>
        </jigsaw-tab-pane>
        <jigsaw-tab-pane title="tab 4" [disabled]="true">
            <ng-template>tab content 4</ng-template>
        </jigsaw-tab-pane>
        <jigsaw-tab-pane>
            <div jigsaw-title><span class="fa fa-bicycle"></span>tab 5</div>
            <ng-template>
                <jigsaw-table [data]="fruitList"></jigsaw-table>
            </ng-template>
        </jigsaw-tab-pane>
        <jigsaw-tab-pane title="tab 6">
            <ng-template>
                <jigsaw-graph [data]="lineBarGraphData"></jigsaw-graph>
            </ng-template>
        </jigsaw-tab-pane>
    </jigsaw-tabs>
</div>

`

const pendingElements = [];
split(input);
console.log(pendingElements);
balanceAutoClosingTags();
const children = fixChildren(pendingElements);
console.log(children)


function split(input) {
    let mark = -1;
    for (let i = 0; i < input.length; i++) {
        if (input[i] == '<') {
            parseTextElement(input.substring(mark + 1, i));
            i += parseElement(input.substring(i)) - 1;
            mark = i;
        } else if (input[i].match(/"|'/)) {
            i += findQuoteEnd(input, i , input[i]) - 1;
        }
    }
    parseTextElement(input.substring(mark + 1));
}

function fixChildren(elements) {
    const groups = [];
    let idx = 0;
    while (true) {
        const descendants = findDescendants(elements[idx]);
        let len = descendants.length > 0 ? descendants.length : element.length - idx;
        groups.push(elements.slice(idx, idx + len));
        idx += len;
        if (idx >= elements.length) {
            break;
        }
    }

    groups.forEach(group => {
        const element = group[0];
        if (group.length <= 2) {
            element.children = undefined;
        } else {
            element.children = fixChildren(group.slice(1, group.length - 1));
        }



        // const element = group[0];
        // if (isChildOnly(group)) {
        //     element.children = group.length > 1 ? group.slice(1, group.length - 1) : undefined;
        // } else {
        //     element.children = fixChildren(group.slice(1, group.length - 1));
        // }
    });
    return groups.map(group => group[0]);
}

function findDescendants(element) {
    let startIndex = pendingElements.indexOf(element);
    if (startIndex == -1) {
        return null;
    }

    if (element.type.match(/text|comment/)) {
        return [element];
    }
    // if (element.type.match(/^meta|base|br|hr|img|input|col|frame|link|area|param|embed|keygen|source$/)) {
    //     // 自关封闭节点，注意自封闭节点也可以有对应的关闭节点，例如
    //     // <input xxx></input>
    //     const siblingElement = pendingElements[startIndex + 1];
    //     return siblingElement.type == `/${element.type}` ? [element, siblingElement] : [element];
    // }

    let count = 1, endIndex = startIndex + 1;
    for (; endIndex < pendingElements.length; endIndex++) {
        const child = pendingElements[endIndex];
        if (element.type == child.type) {
            count++;
        } else if (child.type == `/${element.type}`) {
            count--;
        }
        if (count == 0) {
            break;
        }
    }
    return pendingElements.slice(startIndex, endIndex + 1);
}

function isChildOnly(descendants) {
    if (descendants.length == 1) {
        return true;
    }
    for (let i = 0, len = descendants.length; i < len; i++) {
        let count = 0;
        for (let j = i + 1; j < len; j++) {
            const element = descendants[j];
            if (!element) {
                return true;
            }
            if (element.type.match(/text|comment/)) {
                continue;
            }
            if (element.type[0] != '/') {
                count++;
                if (count > 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

function balanceAutoClosingTags() {
    for (let i = 0; i < pendingElements.length; i++) {
        const element = pendingElements[i];
        const match = element.type.match(/^meta|base|br|hr|img|input|col|frame|link|area|param|embed|keygen|source$/);
        if (!match) {
            continue;
        }
        const siblingElement = pendingElements[i + 1];
        if (siblingElement && siblingElement.type != `/${element.type}`) {
            // 自封闭节点也可以有对应的关闭节点，例如 <input xxx></input>
            // 给省略了的自封闭节点加上封闭tag
            pendingElements.splice(i + 1, 0, {type: `/${element.type}`});
            i++;
        }
    }
}

function parseTextElement(input) {
    if (input == '') {
        return;
    }
    pendingElements.push({type: 'text', innerHtml: input});
}

function parseElement(input) {
    if (input[1] == '/') {
        // a closing tag
        return parseClosingTag(input);
    } else if (input[1] == '!') {
        // a comment tag...
        return parseCommentElement(input);
    } else {
        // a new tag
        return parseTagElement(input);
    }
}

function parseClosingTag(input) {
    const match = input.match(/^<(\/.+?)\s*>/);
    const idx = match ? match[0].length : input.length;
    const tagName = match ? match[1] : input.substring(2); // '</'.length == 2
    pendingElements.push({type: `${tagName}`, innerHtml: ''});
    return idx;
}

function parseCommentElement(input) {
    let idx = input.indexOf('-->');
    idx = idx == -1 ? input.length : idx + 3; // '-->'.length == 3
    pendingElements.push({type: 'comment', innerHtml: input.substring(0, idx)});
    return idx + 1;
}

function parseTagElement(input) {
    const match = input.match(/<(.+?)[\s|>]/);
    const tagName = match ? match[1] : input.substring(1); // strip leading '<'
    const element = {type: tagName, attributes: []};
    pendingElements.push(element);

    const [attributes, tagEnd] = findAttributes(input, tagName.length + 1);
    element.attributes = attributes;

    element.innerHtml = input.substring(0, tagEnd + 1);
    return tagEnd + 1;
}

function findAttributes(input, from) {
    let parts = [], i = from, mark = from;
    for (; i < input.length; i++) {
        if (input[i] == '>') {
            break;
        }
        if (input[i].match(/['"]/)) {
            const quoteEnd = findQuoteEnd(input, i + 1, input[i]);
            // parts.push(input.slice(mark, i + 1).trim());
            parts.push(input.slice(i + 1, quoteEnd));
            i = quoteEnd;
            mark = quoteEnd + 1;
            continue;
        }
        if (input[i].match(/[\s=]/)) {
            parts.push(input.slice(mark, i).trim());
            if (input[i] == '=') {
                parts.push('=');
            }
            mark = i + 1;
            continue;
        }
    }
    parts = parts.filter(p => !!p.trim());
    const attributes = [];
    while (true) {
        const idx = parts.indexOf('=');
        if (idx == -1) {
            break;
        }
        for (let j = 0; j < idx - 1; j++) {
            const name = parts.shift();
            attributes.push({name});
        }
        if (idx == 0) {
            // 类似 =abc 这样的形式，认为属性名为''，补齐进去
            parts.unshift('');
        }
        attributes.push({name: parts[0], value: parts[2]});
        parts.splice(0, 3);
    }
    return [parts.map(name => ({name})).concat(...attributes), i];
}

function findQuoteEnd(input, from, quote) {
    for (let i = from; i < input.length; i++) {
        if (input[i] == '\\') {
            // 跳过转义符
            i++;
            continue;
        }
        if (input[i] == quote) {
            return i;
        }
    }
    return input.length;
}
