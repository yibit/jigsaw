
var input= `<!-- ignore the following lines, they are not important to this demo -->

<input>
`

const pendingNodes = [];
split(input);
console.log(pendingNodes);
fixAutoClosingTags();
const children = fixChildren(pendingNodes);
console.log(children)


function split(input) {
    let mark = -1;
    for (let i = 0; i < input.length; i++) {
        if (input[i] == '<') {
            parseTextNode(input.substring(mark + 1, i));
            i += parseNode(input.substring(i)) - 1;
            mark = i;
        } else if (input[i].match(/"|'/)) {
            i += findQuoteEnd(input, i , input[i]) - 1;
        }
    }
    parseTextNode(input.substring(mark + 1));
}

function fixChildren(nodes) {
    const groups = [];
    let idx = 0;
    while (true) {
        const descendants = findDescendants(nodes[idx]);
        let len = descendants.length > 0 ? descendants.length : node.length - idx;
        groups.push(nodes.slice(idx, idx + len));
        idx += len;
        if (idx >= nodes.length) {
            break;
        }
    }

    groups.forEach(group => {
        const node = group[0];
        if (group.length <= 2) {
            node.children = undefined;
        } else {
            node.children = fixChildren(group.slice(1, group.length - 1));
        }



        // const node = group[0];
        // if (isChildOnly(group)) {
        //     node.children = group.length > 1 ? group.slice(1, group.length - 1) : undefined;
        // } else {
        //     node.children = fixChildren(group.slice(1, group.length - 1));
        // }
    });
    return groups.map(group => group[0]);
}

function findDescendants(node) {
    let startIndex = pendingNodes.indexOf(node);
    if (startIndex == -1) {
        return null;
    }

    if (node.type.match(/text|comment/)) {
        return [node];
    }
    // if (node.type.match(/^meta|base|br|hr|img|input|col|frame|link|area|param|embed|keygen|source$/)) {
    //     // 自关封闭节点，注意自封闭节点也可以有对应的关闭节点，例如
    //     // <input xxx></input>
    //     const siblingNode = pendingNodes[startIndex + 1];
    //     return siblingNode.type == `/${node.type}` ? [node, siblingNode] : [node];
    // }

    let count = 1, endIndex = startIndex + 1;
    for (; endIndex < pendingNodes.length; endIndex++) {
        const child = pendingNodes[endIndex];
        if (node.type == child.type) {
            count++;
        } else if (child.type == `/${node.type}`) {
            count--;
        }
        if (count == 0) {
            break;
        }
    }
    return pendingNodes.slice(startIndex, endIndex + 1);
}

function isChildOnly(descendants) {
    if (descendants.length == 1) {
        return true;
    }
    for (let i = 0, len = descendants.length; i < len; i++) {
        let count = 0;
        for (let j = i + 1; j < len; j++) {
            const node = descendants[j];
            if (!node) {
                return true;
            }
            if (node.type.match(/text|comment/)) {
                continue;
            }
            if (node.type[0] != '/') {
                count++;
                if (count > 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

function fixAutoClosingTags() {
    for (let i = 0; i < pendingNodes.length; i++) {
        const node = pendingNodes[i];
        const match = node.type.match(/^(meta|base|br|hr|img|input|col|frame|link|area|param|embed|keygen|source)$/);
        if (!match) {
            continue;
        }
        // 自封闭节点也可以有对应的关闭节点，例如 <input xxx></input>
        // 给省略了的自封闭节点加上封闭tag
        pendingNodes.splice(i + 1, {type: `/${match[1]}`});
    }
}

function parseTextNode(input) {
    if (input == '') {
        return;
    }
    pendingNodes.push({type: 'text', innerHtml: input});
}

function parseNode(input) {
    if (input[1] == '/') {
        // a closing tag
        return parseClosingTag(input);
    } else if (input[1] == '!') {
        // a comment tag...
        return parseCommentNode(input);
    } else {
        // a new tag
        return parseTagNode(input);
    }
}

function parseClosingTag(input) {
    const match = input.match(/^<(\/.+?)\s*>/);
    const idx = match ? match[0].length : input.length;
    const tagName = match ? match[1] : input.substring(2); // '</'.length == 2
    pendingNodes.push({type: `${tagName}`, innerHtml: ''});
    return idx;
}

function parseCommentNode(input) {
    let idx = input.indexOf('-->');
    idx = idx == -1 ? input.length : idx + 3; // '-->'.length == 3
    pendingNodes.push({type: 'comment', innerHtml: input.substring(0, idx)});
    return idx + 1;
}

function parseTagNode(input) {
    let match = input.match(/<(.+?)[\s|>]/);
    let tagName = match ? match[1] : input.substring(1); // strip leading '<'
    let node = {type: tagName, attributes: []};
    pendingNodes.push(node);

    let start = tagName.length + 1;
    while(true) {
        let attr = findAttribute(input, start);
        if (!attr) {
            break;
        }
        node.attributes.push(attr);
        start = attr.endIndex + 1;
    }

    var lastAttr = node.attributes[node.attributes.length - 1];
    var endTag = findTagEnd(input, lastAttr ? lastAttr.endIndex : tagName.length + 1);
    endTag++;
    node.innerHtml = input.substring(0, endTag);
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
    var tagEnd = input.length;
    for (var i = from; i < input.length; i++) {
        if (input[i] == '>') {
            tagEnd = i;
            break;
        }
    }
    return tagEnd;
}
























// function findNextNode(input, from) {
//     for (var i = from; i < input.length; i++) {
//         if (input[i] == '<') {
//             if (input[i+1] == '/') {
//                 // closing tag
//             } else {
//                 // a new child tag
//                 findNode(input, i);
//             }
//             return i;
//         } else if (input[i].match(/"|'/)) {
//             i = findQuoteEnd(input, i + 1, input[i]);
//         }
//     }



//     // input = input.substring(from);
//     // var tagStart = input.match(/<.+?\s+|>/);
//     // var tagStartPos = tagStart ? tagStart.index : input.length;
//     // var quoteStart = input.match(/"|'/);
//     // var quoteStartPos = quoteStart ? quoteStart.index : input.length;

//     // if (tagStartPos < quoteStartPos) {
//     //     findNode(input, tagStartPos, tagStart[0]);
//     // } else if (quoteStartPos < tagStartPos) {
//     //     var quoteInfo = findQuote(input, quoteStartPos);
//     //     if (quoteInfo) {
//     //         findNextNode(input, quote.index);
//     //     }
//     // } else {
//     //     // the end
//     // }
//     // return tagStart;
// }

// function isClosingTag(input, from) {
//     input.substring(from).match(/<\/.+?\s*>/);
// }

// function findNode(input, from) {
//     var sub = input.substring(from);
//     var match = sub.match(/<(.+?)\s/);
//     var tagName = match ? match[1] : sub;
//     var node = new Node(tagName);
//     pendingTag.push(node);

//     var start = from + tagName.length;
//     while(true) {
//         var attr = findAttribute(input, start);
//         if (!attr) {
//             break;
//         }
//         node.attributes.push(attr);
//         start = attr.endIndex + 1;
//     }

//     var lastAttr = node.attributes[node.attributes.length - 1];
//     var idx = findTagEnd(input, lastAttr.endIndex);
//     if (idx !== input.length) {
//         var nextTagStart = findNextNode(input, idx + 1);
//         node.innerHtml = input.substring(from, nextTagStart);
//         pendingTag.pop(node);
//         if (pendingTag.length == 0) {
//             nodes.push(node);
//         }
//     } else {
//         node.innerHtml = input.substring(from);
//     }

// }

// function findAttribute(input, from) {
//     var nameEndIndex = findAttributeNameEnd(input, from);
//     for (var i = nameEndIndex; i < input.length; i++) {
//         if (input[i] == '=') {
//             var name = input.slice(from, i);
//             var quoteStart = findQuoteStart(input, i+1);
//             var endIndex = quoteStart ? findQuoteEnd(input, quoteStart.index + 1, quoteStart.quote) : i;
//             var value = quoteStart ? input.slice(i + 1, endIndex) : undefined;
//             return {name: name, value: value, startIndex: from, endIndex: endIndex};
//         } else if (input[i] == '>') {
//             var name = input.slice(from, i).trim();
//             var value = undefined;
//             return name ? {name: name, value: value, startIndex: from, endIndex: endIndex} : null;
//         }
//     }

// }

// function findQuoteEnd(input, from, quote) {
//     for (var i = from; i < input.length; i++) {
//         if (input[i] == '\\') {
//             // 跳过转义符
//             i++;
//         }
//         if (input[i] == quote) {
//             return i;
//         }
//     }
//     return input.length;
// }

// function Node(tag) {
//     this.tag = tag;
//     this.attributes = [];
//     this.innerHtml = '';
// }

// String host = '10.10.10.10:3424';
// int index = host.indexOf(':');
// String ip = host.substring(0, index);
// String port = host.substring(index+1);