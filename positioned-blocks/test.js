
const colors = [
  'ECF1EF', 'FCF6CF', '7FFFD4', '66CDAA', '458B74', 'C1CDCD', 'EED5B7', 'CDB79E',
  '8A2BE2', 'A52A2A', '5F9EA0', '98F5FF', '8EE5EE', '7AC5CD', '458B00', 'D2691E',
  'CD661D', '8B4513'
]


// let blocks = {
//   1: {
//     origin: {
//       width: 3, height: 4, unit: 'px', left: NaN, top: NaN
//     },
//     width: '', minWidth: '', height: '', minHeight: '', left: '', top: ''
//   }
// }

let blocks = {}

let src = `
1 1 1 1   a a a a a b b b b b b b   2 2 2 2 c c c c 3 3 3 4 4 4 4 4 d d d d d d
1 1 1 1   a a a a a b b b b b b b   2 2 2 2 c c c c 3 3 3 4 4 4 4 4 d d d d d d
1 1 1 1   a a a a a b b b b b b b   2 2 2 2 c c c c 3 3 3 4 4 4 4 4 d d d d d d
`
///////////////////////////////////////////////////////////
const UNIT_LENGTH = 30;

src = prepare(src);
console.log(src);
console.log(blocks);
positionAllBlocks(src);
console.log(blocks);
toHtml()


function positionAllBlocks(matrix) {
  matrix.forEach((row, top) => {
    row.forEach((blockId, left) => {
      const block = blocks[blockId];
      if (!block) {
        // 是空白块
        return;
      }
      if (!hasPositioned(block)) {
        // 未定位的块立即定位它
        positionBlock(left, top, block);
      }
    });
  })
}

function positionBlock(left, top, block) {
  const [leftNeighbour, nl, nt] = findLeftNeighbour(left, top, block.origin.height);
  if (leftNeighbour && !hasPositioned(leftNeighbour)) {
    // 未定位的块需要先给它定位一下
    positionBlock(nl, nt, leftNeighbour);
  }

  const from = !!leftNeighbour ? leftNeighbour.origin.left + leftNeighbour.origin.width : 0;
  const gapPxValue = src[top].slice(from, left).length * UNIT_LENGTH;
  if (block.origin.unit == 'px') {
    block.width = `${block.origin.width * UNIT_LENGTH}px`;
  } else {
    // 1. 真实的width值需要按比例计算
    // 2. 需要减去固定宽度、gap，变成类似calc(100% - 33px)
    block.width = getPercentBlockWidth(left, top, block, gapPxValue);
  }

  block.left = !leftNeighbour ? `${gapPxValue}px` :
    getCssCalc(leftNeighbour.left, leftNeighbour.width, gapPxValue);
}

function getPercentBlockWidth(left, top, block, gapPxValue) {
  const row = src[top];
  const list = row.map(id => blocks[id]);
  const percentBlocks = []
  list.filter(b => b && b.origin.unit == '%').forEach(b => percentBlocks.indexOf(b) == -1 && percentBlocks.push(b));
  const fixedBlocks = [];
  list.filter(b => b && b.origin.unit == 'px').forEach(b => fixedBlocks.indexOf(b) == -1 && fixedBlocks.push(b));
  const allPercentValue = percentBlocks.reduce((sum, curBlock) => sum + curBlock.origin.width, 0);
  const allPxValue = fixedBlocks.reduce((sum, curBlock) => sum + curBlock.origin.width * UNIT_LENGTH, 0) + gapPxValue;

  return `calc(${numericTrim(block.origin.width/allPercentValue*100)}% - ${numericTrim(allPxValue*block.origin.width/allPercentValue)}px)`;
}

function numericTrim(value) {
  value = (value + '').replace(/(\d+)\.?(\d*)/, (found, n1, n2) => `${n1}.${n2.substring(0, 2)}`);
  return parseFloat(value);
}

/*
 * 从右向左，从上到下找到第一个有效id，并返回其对应的block
 */
function findLeftNeighbour(left, top, height) {
  const bottom = top + height;
  for (let lv = left -1; lv >= 0; lv--) {
    for (let tv = top; tv < bottom; tv++) {
      if (!!src[tv][lv]) {
        const block = blocks[src[tv][lv]];
        return [block, lv - block.origin.width + 1, tv];
      }
    }
  }
  return [null, NaN, NaN];
}

function getCssCalc(calc, value, gapPxValue) {
  if (!calc) {
    calc = 'calc(0px)';
  } else if (!calc.match(/^calc\(/)) {
    calc = `calc(${calc})`;
  }

  value = calc.replace(/^calc\((.+)\)$/, `$1+${value}`);
  // 把 `calc(100% - 90px)` 处理成 `calc(100% + -90px)`
  // 方便后面的处理
  value = value.replace(/-\s*/g, '+ -');

  let sum = { 'px': 0, '%': 0 };
  value.split(/\s*\+\s*/).forEach(v => {
    const match = v.match(/(-?[\d.]+)(px|%)/);
    sum[match[2]] += parseInt(match[1]);
  });
  sum['px'] += gapPxValue;
  if (!sum['%']) {
    return `${sum['px']}px`;
  }
  if (!sum['px']) {
    return `${sum['%']}%`;
  }

  let result = `calc(${sum['%']}% + ${sum['px']}px)`;
  // 把 `calc(100% + -90px)` 处理成 `calc(100% - 90px)`
  return result.replace(/\+\s*-/g, '- ');
}

function hasPositioned(block) {
  return !!block && !!block.left;
}

//////////////////////////////////////////////////

function prepare(source) {
  const result = source.replace(/  /g, ' ').split(/\n/g).slice(1, Infinity).map(row => row.split(/ /g));
  result.forEach((row, top) => {
    row.forEach((id, left) => {
      let block = blocks[id];
      if (!!block || !id) {
        return;
      }
      blocks[id] = {
        origin: {
          width: row.filter(i => i === id).length,
          height: result.filter(r => r[left] === id).length,
          left: left, top: top, unit: result[top][left].match(/\d+/) ? 'px' : '%'
        }
      };
    });
  });
  return result;
}


function toHtml() {
  let html = '', idx = 0;
  for(let id in blocks) {
    const block = blocks[id];
    html += `
      <div style="
        position: absolute; 
        width: ${block.width}; height: 250px; left: ${block.left}; top: 0;
        background-color: #${colors[++idx]}; font-size: 10px;
      ">unit=${block.origin.unit}<br>width=${block.width}<br>id=${id}</div>
    `;
  }
  console.log(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>positioned blocks</title>
</head>
<body style="margin:0; padding:0; width: 1000px height: 600px">
${html}
</body>
</html>`);
}


