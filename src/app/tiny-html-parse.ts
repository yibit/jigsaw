
export const simulatedDocument = {
    createElement: (name: string) => {
        return new Element(name);
    }
};

export class Element {
    constructor(name: string) {
        this.tagName = name;
    }

    public tagName: string;

    private _innerHTML: string;

    public get innerHTML(): string {
        return this._innerHTML;
    }

    public set innerHTML(value: string) {
        this._innerHTML = value;
        this.pendingElements = [];
        this.split(value);
        this.balanceAutoClosingTags();
        this._childNodes = this.fixChildren(this.pendingElements);
    }

    private _childNodes: Element[];

    public get childNodes(): Element[] {
        return this._childNodes;
    }

    private pendingElements: {type: string, rawText?: string, attributes?: any[]}[];

    private split(input) {
        let mark = -1;
        for (let i = 0; i < input.length; i++) {
            if (input[i] == '<') {
                this.parseTextElement(input.substring(mark + 1, i));
                i += this.parseElement(input.substring(i)) - 1;
                mark = i;
            } else if (input[i].match(/"|'/)) {
                i += this.findQuoteEnd(input, i , input[i]) - 1;
            }
        }
        this.parseTextElement(input.substring(mark + 1));
    }


    private fixChildren(elements) {
        const groups = [];
        let idx = 0;
        while (true) {
            const descendants = this.findDescendants(elements[idx]);
            let len = descendants.length > 0 ? descendants.length : elements.length - idx;
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
                element.children = this.fixChildren(group.slice(1, group.length - 1));
            }
        });
        return groups.map(group => group[0]);
    }

    private findDescendants(element) {
        let startIndex = this.pendingElements.indexOf(element);
        if (startIndex == -1) {
            return null;
        }

        if (element.type.match(/text|comment/)) {
            return [element];
        }

        let count = 1, endIndex = startIndex + 1;
        for (; endIndex < this.pendingElements.length; endIndex++) {
            const child = this.pendingElements[endIndex];
            if (element.type == child.type) {
                count++;
            } else if (child.type == `/${element.type}`) {
                count--;
            }
            if (count == 0) {
                break;
            }
        }
        return this.pendingElements.slice(startIndex, endIndex + 1);
    }

    private isChildOnly(descendants) {
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

    private balanceAutoClosingTags() {
        for (let i = 0; i < this.pendingElements.length; i++) {
            const element = this.pendingElements[i];
            const match = element.type.match(/^meta|base|br|hr|img|input|col|frame|link|area|param|embed|keygen|source$/);
            if (!match) {
                continue;
            }
            const siblingElement = this.pendingElements[i + 1];
            if (siblingElement && siblingElement.type != `/${element.type}`) {
                // 自封闭节点也可以有对应的关闭节点，例如 <input xxx></input>
                // 给省略了的自封闭节点加上封闭tag
                this.pendingElements.splice(i + 1, 0, {type: `/${element.type}`});
            }
        }
    }

    private parseTextElement(input) {
        if (input == '') {
            return;
        }
        this.pendingElements.push({type: 'text', rawText: input});
    }

    private parseElement(input) {
        if (input[1] == '/') {
            // a closing tag
            return this.parseClosingTag(input);
        } else if (input[1] == '!') {
            // a comment tag...
            return this.parseCommentElement(input);
        } else {
            // a new tag
            return this.parseTagElement(input);
        }
    }

    private parseClosingTag(input) {
        const match = input.match(/^<(\/.+?)\s*>/);
        const idx = match ? match[0].length : input.length;
        const tagName = match ? match[1] : input.substring(2); // '</'.length == 2
        this.pendingElements.push({type: `${tagName}`, rawText: ''});
        return idx;
    }

    private parseCommentElement(input) {
        let idx = input.indexOf('-->');
        idx = idx == -1 ? input.length : idx + 3; // '-->'.length == 3
        this.pendingElements.push({type: 'comment', rawText: input.substring(0, idx)});
        return idx + 1;
    }

    private parseTagElement(input) {
        let match = input.match(/<(.+?)[\s|>]/);
        let tagName = match ? match[1] : input.substring(1); // strip leading '<'
        let element = {type: tagName, attributes: [], rawText: undefined};
        this.pendingElements.push(element);

        let start = tagName.length + 1;
        while(true) {
            let attr = this.findAttribute(input, start);
            if (!attr) {
                break;
            }
            element.attributes.push(attr);
            start = attr.endIndex + 1;
        }

        let lastAttr = element.attributes[element.attributes.length - 1];
        let endTag = this.findTagEnd(input, lastAttr ? lastAttr.endIndex : tagName.length + 1);
        endTag++;
        element.rawText = input.substring(0, endTag);
        return endTag;
    }

    private findAttribute(input, from) {
        let nameEndIndex = this.findAttributeNameEnd(input, from);
        for (let i = nameEndIndex; i < input.length; i++) {
            if (input[i] == '=') {
                let name = input.slice(from, i).trim();
                let quoteStart = this.findQuoteStart(input, i+1);
                let endIndex = quoteStart ? this.findQuoteEnd(input, quoteStart.index + 1, quoteStart.quote) : i;
                let value = quoteStart ? input.slice(quoteStart.index + 1, endIndex) : undefined;
                return {name: name, value: value, startIndex: from, endIndex: endIndex};
            } else if (input[i] == '>') {
                let name = input.slice(from, i).trim();
                let value = undefined;
                return name ? {name: name, value: value, startIndex: from, endIndex: i - 1} : null;
            }
        }
    }

    private findAttributeNameEnd(input, from) {
        for (let i = from; i < input.length; i++) {
            if (input[i] == '=' || input[i] == '>' || input[i] == ' ') {
                return i;
            }
        }
        return input.length;
    }

    private findQuoteStart(input, from) {
        for (let i = from; i < input.length; i++) {
            let match = input[i].match(/"|'/);
            if (match) {
                return {index:i, quote: match[0]};
            }
        }
        return null;
    }

    private findQuoteEnd(input, from, quote) {
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

    private findTagEnd(input, from) {
        let tagEnd = input.length;
        for (let i = from; i < input.length; i++) {
            if (input[i] == '>') {
                tagEnd = i;
                break;
            }
        }
        return tagEnd;
    }
}
