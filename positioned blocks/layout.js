// {
//     direction: 'row'/'column', blocks: [
//     ]
// }
const colors = [
  'ECF1EF', 'FCF6CF', '7FFFD4', '66CDAA', '458B74', 'C2CDCD', 'EED5B7', 'CDB79E',
  '8A2BE2', 'A52A2A', '5F9EA0', '98F5FF', '8EE5EE', '7AC5CD', '458B00', 'D2691E',
  'CD661D', '8B4513'
]

const types = {
    0: 'fixed', 1: 'hor', 2: 'ver', 3: 'all'
}

let blockInfo = {}

let source = `
a0  a0  a0      b0  b0  b0  b0  b0  b0      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
a0  a0  a0      b0  b0  b0  b0  b0  b0      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
a0  a0  a0      b0  b0  b0  b0  b0  b0      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
a0  a0  a0      b0  b0  b0  b0  b0  b0      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
                                            e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
c2  c2  c2      d2  d2  d2  d2  d2  d2      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
c2  c2  c2      d2  d2  d2  d2  d2  d2      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
c2  c2  c2      d2  d2  d2  d2  d2  d2      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
c2  c2  c2      d2  d2  d2  d2  d2  d2      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
c2  c2  c2      d2  d2  d2  d2  d2  d2      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
c2  c2  c2      d2  d2  d2  d2  d2  d2      e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1  e1
                                                                                                                    
f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3
f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3
f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3  f3
`
///////////////////////////////////////////////////////////
const UNIT_LENGTH = 30;
prepare();
console.log(source);
console.log(blockInfo);
toHtml(layout(source));

function layout(source, direction) {
    const separator = checkSeparator(source);
    if (separator) {
        return `<div style="width:${separator.width}px; height:${separator.height}px"></div>`;
    }

    const [blocks, childDirection] = slice(source);
    const slicable = blocks.length > 1;
    let sizeAndGrow = calcSizeAndGrow(source, direction, slicable);

    if (!slicable) {
        // 切到只剩下一块了
        return `<div style="${sizeAndGrow} background-color:#${colors[random(colors.length-1)]};">
            ${source[0][0]}
        </div>`;
    }

    const flexDirection = !!direction ? `flex-direction:${childDirection};` : '';
    let html = `<div style="display:flex; ${flexDirection} ${sizeAndGrow}">\n`;
    blocks.forEach(block => {
        html += layout(block, childDirection) + '\n';
    });
    html += '</div>';
    return html;
}

function slice(source) {
    const verBlocks = verSlice(source);
    const horBlocks = horSlice(source);
    if (verBlocks.length == 1 && horBlocks.length == 1) {
        return [[source], ''];
    }
    const blocks = verBlocks.length >= horBlocks.length ? verBlocks : horBlocks;
    const direction = verBlocks.length >= horBlocks.length ? 'row' : 'column';
    return [blocks, direction];
}

function verSlice(source) {
    const borders = [];
    const columns = source[0].length;
    for (let col = 1; col < columns; col++) {
        const found = source.find(row => !!row[col] && row[col] === row[col-1]);
        if (!found) {
            borders.push(col);
        }
    }
    if (borders.length == 0) {
        return [source];
    }

    borders.unshift(0);
    borders.push(columns);
    const blocks = [];
    borders.forEach((start, idx) => {
        if (start === columns) {
            return;
        }
        const end = borders[idx + 1];
        const block = source.map(row => row.slice(start, end));
        blocks.push(block);
    });

    return blocks;
}

function horSlice(source) {
    const borders = [];
    source.forEach((row, rowIdx) => {
        if (rowIdx == 0) {
            return;
        }
        const lastRow = source[rowIdx - 1];
        const found = row.find((id, colIdx) => !!id && id === lastRow[colIdx]);
        if (!found) {
            borders.push(rowIdx);
        }
    });
    if (borders.length == 0) {
        return [source];
    }

    borders.unshift(0);
    borders.push(source.length);

    const blocks = [];
    borders.forEach((start, idx) => {
        if (start === source.length) {
            return;
        }
        const end = borders[idx + 1];
        const block = source.slice(start, end);
        blocks.push(block);
    });

    return blocks;    
}

function checkSeparator(source) {
    const width = source[0].length * UNIT_LENGTH;
    const height = source.length * UNIT_LENGTH;
    const isSeparator = width > 0 && height > 0 && source.find(row => row.find(id => !!id)) === undefined;
    let result;
    if (isSeparator) {
        result = {width, height};
    }
    return result;
}

function containsMultipleBlocks(block) {
    const target = block[0][0];
    return block.find(row => row.find(id => id !== target));
}

function calcSizeAndGrow(source, direction, slicable) {
    const grow = calcGrow(source, direction);
    const physicalSize = !slicable ? calcPhysicalSize(source) : {width: '100%', height: '100%'};

    if (direction == 'row') {
        return grow == 0 ? `width:${source[0].length * UNIT_LENGTH}px; height:${physicalSize.height};` :
            `flex-grow:${grow}; height:${physicalSize.height};`;
    } else if (direction == 'column') {
        return grow == 0 ? `width:${physicalSize.width}; height:${source.length * UNIT_LENGTH}px;` :
            `width:${physicalSize.width}; flex-grow:${grow};`;
    } else {
        return 'width:100%; height:100%;';
    }
}

function calcGrow(source, direction) {
    let grows;
    if (direction == 'row') {
        grows = source.map(row => row.reduce((grow, id) => {
            const info = blockInfo[id];
            if (info && (info.type == 'hor' || info.type == 'all')) {
                grow++;
            }
            return grow;
        }, 0));
    } else if (direction == 'column') {
        grows = [];
        for (let col = 0, columns = source[0].length; col < columns; col++) {
            let grow = 0;
            for (let row = 0, rows = source.length; row < rows; row++) {
                const id = source[row][col];
                const info = blockInfo[id];
                if (!info) {
                    continue;
                }
                if (info.type == 'ver' || info.type == 'all') {
                    grow++;
                }
            }
            grows.push(grow);
        }
    }
    if (!grows || grows.length == 0) {
        grows = [0];
    }
    return Math.max(...grows);
}

// 计算单区块的物理尺寸，只用于计算不可切分区块。
function calcPhysicalSize(source) {
    if (containsMultipleBlocks(source)) {
        // 包含多个不同块，且不能再切分，我们只能无视其延展性，认为它是固定尺寸
        return {
            width: `${source[0].length * UNIT_LENGTH}px`,
            height: `${source.length * UNIT_LENGTH}px`
        };
    } else {
        const id = source[0][0];
        const scaleType = blockInfo[id].type;
        return {
            width: scaleType == 'fixed' || scaleType == 'ver' ?
                `${source[0].length * UNIT_LENGTH}px` : '100%',
            height: scaleType == 'fixed' || scaleType == 'hor' ?
                `${source.length * UNIT_LENGTH}px` : '100%'
        }
    }
}


//////////////////////////////////////////////////


function prepare() {
    source = source.replace(/    /g, '  ').split(/\n/g).slice(1, Infinity).map(row => row.split(/  /g));
    source.splice(source.length - 1, 1);
    source.forEach((row, top) => {
        row.forEach((id, left) => {
            let block = blockInfo[id];
            if (!!block || !id) {
                return;
            }
            blockInfo[id] = {
                width: row.filter(i => i === id).length,
                height: source.filter(r => r[left] === id).length,
                left: left, top: top, type: types[  source[top][left].match(/\w(\d+)/)[1]  ]
            };
        });
    });
}


function toHtml(html) {
    html= `
        <!DOCTYPE html>
        <html style="width: 100%; height: 100%;">
        <head>
        <meta charset="utf-8">
        <title>positioned blocks</title>
        </head>
        <body style="margin:0; padding:0; width: 100%; height: 100%;">

        ${html}

        </body>
        </html>
    `;
    document.body.innerHTML = html;
    console.log(html);
}

function random(max) {
    return Math.round(Math.random() * max)
}

