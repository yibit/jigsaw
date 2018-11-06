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

prepare();
console.log(source);
console.log(blockInfo);
console.log(layout(source));

function layout(source) {
    const [blocks, direction] = slice(source);
    const size = direction == 'row' ? 'height:100%' : 'width:100%';

    let html;
    if (blocks.length == 1) {
        // 切到只剩下一块了
        html = `<div style="flex-grow: 4; ${size}; background-color: #FCF6CF"></div>`;
    } else {
        let html = `<div style="display:flex; flex-direction:row; ${size};">`;
        blocks.forEach(block => {
            html += layout(block) + '\n';
        });
        html += '</div>';
    }
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
        origin: {
          width: row.filter(i => i === id).length,
          height: source.filter(r => r[left] === id).length,
          left: left, top: top, type: types[  source[top][left].match(/\w(\d+)/)[1]  ]
        }
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


