
let input= `<!-- ignore the following lines, they are not important to this demo -->

<input>
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
            pendingElements.splice(i + 1, {type: `/${element.type}`});
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
    let match = input.match(/<(.+?)[\s|>]/);
    let tagName = match ? match[1] : input.substring(1); // strip leading '<'
    let element = {type: tagName, attributes: []};
    pendingElements.push(element);

    let start = tagName.length + 1;
    while(true) {
        let attr = findAttribute(input, start);
        if (!attr) {
            break;
        }
        element.attributes.push(attr);
        start = attr.endIndex + 1;
    }

    let lastAttr = element.attributes[element.attributes.length - 1];
    let endTag = findTagEnd(input, lastAttr ? lastAttr.endIndex : tagName.length + 1);
    endTag++;
    element.innerHtml = input.substring(0, endTag);
    return endTag;
}

function findAttribute(input, from) {
    let nameEndIndex = findAttributeNameEnd(input, from);
    for (let i = nameEndIndex; i < input.length; i++) {
        if (input[i] == '=') {
            let name = input.slice(from, i).trim();
            let quoteStart = findQuoteStart(input, i+1);
            let endIndex = quoteStart ? findQuoteEnd(input, quoteStart.index + 1, quoteStart.quote) : i;
            let value = quoteStart ? input.slice(quoteStart.index + 1, endIndex) : undefined;
            return {name: name, value: value, startIndex: from, endIndex: endIndex};
        } else if (input[i] == '>') {
            let name = input.slice(from, i).trim();
            let value = undefined;
            return name ? {name: name, value: value, startIndex: from, endIndex: i - 1} : null;
        }
    }

}

function findAttributeNameEnd(input, from) {
    for (let i = from; i < input.length; i++) {
        if (input[i] == '=' || input[i] == '>' || input[i] == ' ') {
            return i;
        }
    }
    return input.length;
}

function findQuoteStart(input, from) {
    for (let i = from; i < input.length; i++) {
        let match = input[i].match(/"|'/);
        if (match) {
            return {index:i, quote: match[0]};
        }
    }
    return null;
}

function findQuoteEnd(input, from, quote) {
    for (let i = from; i < input.length; i++) {
        if (input[i] == '\\') {
            // 跳过转义符
            i++;
        }
        if (input[i] == quote) {
            return i;
        }
    }
    return input.length;
}

function findTagEnd(input, from) {
    let tagEnd = input.length;
    for (let i = from; i < input.length; i++) {
        if (input[i] == '>') {
            tagEnd = i;
            break;
        }
    }
    return tagEnd;
}
