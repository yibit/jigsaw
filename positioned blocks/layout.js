// {
//     direction: 'row'/'column', blocks: [
//     ]
// }

const types = {
    0: 'fixed', 1: 'hor', 2: 'ver', 3: 'all'
}

let blockInfo = {}

let source = `
a0  a0  a0      b0  b0      e0  e0  e0
a0  a0  a0      b0  b0      e0  e0  e0
a0  a0  a0      b0  b0      e0  e0  e0
a0  a0  a0      b0  b0      e0  e0  e0
                                    
c2  c2  c2      d2  d2      f3  f3  f3
c2  c2  c2      d2  d2      f3  f3  f3
c2  c2  c2      d2  d2      f3  f3  f3
c2  c2  c2      d2  d2      f3  f3  f3
c2  c2  c2      d2  d2      f3  f3  f3
c2  c2  c2      d2  d2      f3  f3  f3
`
///////////////////////////////////////////////////////////
const UNIT_LENGTH = 30;
prepare();
console.log(source);
console.log(blockInfo);
console.log(layout(source));

function layout(source, direction) {
    const separator = checkSeparator(source);
    if (separator) {
        return `<div style="width:${separator.width}px; height:${separator.height}px"></div>`;
    }

    const [blocks, nextDirection] = slice(source);
    let sizeAndGrow = calcSizeAndGrow(source, direction);

    if (blocks.length == 1) {
        // 切到只剩下一块了
        return `<div style="${sizeAndGrow} background-color:#FCF6CF;"></div>`;
    }

    const flexDirection = !!direction ? `flex-direction:${direction};` : '';
    let html = `<div style="display:flex; ${flexDirection} ${sizeAndGrow}">\n`;
    blocks.forEach(block => {
        html += layout(block, nextDirection) + '\n';
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

function calcGrow(source, direction) {
    // return blocks.map(block => {
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
        // const grow = Math.max(...grows);
        // return grow > 0 ? `flex-grow:${grow};` : '';
    // });
}

function calcSizeAndGrow(source, direction) {
    const grow = calcGrow(source, direction);

    // return blocks.map((block, idx) => {
        // const grow = grows[idx];
        if (direction == 'row') {
            return grow == 0 ? `width:${source[0].length * UNIT_LENGTH}px; height:100%;` :
                `flex-grow:${grow}; height:100%;`;
        } else if (direction == 'column') {
            return grow == 0 ? `width:100%; height:${source.length * UNIT_LENGTH}px;` :
                `width:100%; flex-grow:${grow};`;
        } else {
            return 'width:100%; height:100%;';
        }
    // });
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


function toHtml() {
  let html = '', idx = 0;
  for(let id in blockInfo) {
    const block = blockInfo[id];
    html += `
      <div style="
        position: absolute; 
        width: ${block.width}; height: 250px; left: ${block.left}; top: 0;
        background-color: #${colors[++idx]}; font-size: 10px;
      ">width=${block.width}<br>id=${id}</div>
    `;
  }
  console.log(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>positioned blockInfo</title>
</head>
<body style="margin:0; padding:0; width: 1000px height: 600px">
${html}
</body>
</html>`);
}


