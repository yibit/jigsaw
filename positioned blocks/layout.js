// {
//     direction: 'row'/'column', blocks: [
//     ]
// }
const colors = [
  'ECF1EF', 'FCF6CF', '7FFFD4', '66CDAA', '458B74', 'C2CDCD', 'EED5B7', 'CDB79E',
  '8A2BE2', 'A52A2A', '5F9EA0', '98F5FF', '8EE5EE', '7AC5CD', '458B00', 'D2691E',
  'CD661D', '8B4513'
]

const scaleDirections = {
    0: 'none', 1: 'hor', 2: 'ver', 3: 'both'
}

const svds = [];

let source = `
                                                                                                                                                                                                                                                                                                                                                                                                                
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
                                                                                                                                                                                                                                                                                                                                                                                                                
    f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0      g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
    f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0      g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
    f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0      g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
    f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0      g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
    f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0      g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
    f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0  f0      g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
                                                                                                                                                                                                                                                                                                                                                                                                                
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1  n1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2                                                                                                                                                                                                                                                                                                          
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3  o3
                                                                                                                                                                                                                                                                                                                                                                                                                
    p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1
    p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1
    p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1
    p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1  p1
`


function toSvdList(source) {
    source = source.replace(/    /g, '  ').split(/\n/g).slice(1, Infinity).map(row => row.split(/  /g));
    source.splice(source.length - 1, 1);
    source.forEach((row, top) => {
        row.forEach((id, left) => {
            if (!id || svds.find(svd => svd.id === id)) {
                return;
            }
            const tmp = source.filter(r => r.find(c => c === id)).map(r => r.filter(c => c === id));
            const scaleDirection = scaleDirections[id.match(/\w(\d+)/)[1]];
            svds.push({
                id, left, top, scaleDirection,
                width: tmp[0].length, height: tmp.length
            });
        });
    });
}


function toHtml(html) {
    document.body.innerHTML = html;
    // console.log(html);
}

function random(max) {
    return Math.round(Math.random() * max)
}

toSvdList(source)
console.log(svds);


// 以上代码实际运行时用不到
///////////////////////////////////////////////////////////




const UNIT_LENGTH = 8;
const matrix = toMatrix(svds);
toHtml(layout(matrix));

function layout(matrix, direction) {
    const separator = checkSeparator(matrix);
    if (separator) {
        const size = direction == 'column' ?
            `min-height:${separator.height}px; max-height:${separator.height}px;` :
            `min-width:${separator.width}px; max-width:${separator.width}px;`;
        return `<div style="${size} background-color: #ddd"></div>`;
    }

    const [blocks, childDirection] = slice(matrix);
    const slicable = blocks.length > 1;
    let sizeAndGrow = calcSizeAndGrow(matrix, direction, slicable);

    if (!slicable) {
        // 切到只剩下一块了
        return `
            <div style="${sizeAndGrow}">
                <div style="width:100%; height:100%; background-color:#${colors[random(colors.length-1)]};">
                    ${matrix[0][0].id}
                </div>
            </div>
        `;
    }

    const flexDirection = !!childDirection ? `flex-direction:${childDirection};` : '';
    let html = `<div style="display:flex; ${flexDirection} ${sizeAndGrow}">\n`;
    blocks.forEach(block => {
        html += layout(block, childDirection) + '\n';
    });
    html += '</div>';
    return html;
}

function slice(matrix) {
    const verBlocks = verSlice(matrix);
    const horBlocks = horSlice(matrix);
    if (verBlocks.length == 1 && horBlocks.length == 1) {
        return [[matrix], ''];
    }
    const blocks = verBlocks.length >= horBlocks.length ? verBlocks : horBlocks;
    const direction = verBlocks.length >= horBlocks.length ? 'row' : 'column';
    return [blocks, direction];
}

function verSlice(matrix) {
    const borders = [];
    const columns = matrix[0].length;
    for (let col = 1; col < columns; col++) {
        const found = matrix.find(row => !!row[col] && row[col] === row[col-1]);
        if (!found) {
            borders.push(col);
        }
    }
    if (borders.length == 0) {
        return [matrix];
    }

    borders.unshift(0);
    borders.push(columns);
    const blocks = [];
    borders.forEach((start, idx) => {
        if (start === columns) {
            return;
        }
        const end = borders[idx + 1];
        const block = matrix.map(row => row.slice(start, end));
        blocks.push(block);
    });

    return blocks;
}

function horSlice(matrix) {
    const borders = [];
    matrix.forEach((row, rowIdx) => {
        if (rowIdx == 0) {
            return;
        }
        const lastRow = matrix[rowIdx - 1];
        const found = row.find((svd, colIdx) => !!svd && svd === lastRow[colIdx]);
        if (!found) {
            borders.push(rowIdx);
        }
    });
    if (borders.length == 0) {
        return [matrix];
    }

    borders.unshift(0);
    borders.push(matrix.length);

    const blocks = [];
    borders.forEach((start, idx) => {
        if (start === matrix.length) {
            return;
        }
        const end = borders[idx + 1];
        const block = matrix.slice(start, end);
        blocks.push(block);
    });

    return blocks;    
}

function checkSeparator(matrix) {
    const width = matrix[0].length * UNIT_LENGTH;
    const height = matrix.length * UNIT_LENGTH;
    const isSeparator = width > 0 && height > 0 && matrix.find(row => row.find(svd => !!svd)) === undefined;
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

function calcSizeAndGrow(matrix, direction, slicable) {
    const grow = calcGrow(matrix, direction);
    const physicalSize = !slicable ? calcPhysicalSize(matrix) : {width: '100%', height: '100%'};

    if (direction == 'row') {
        return grow == 0 ? `width:${matrix[0].length * UNIT_LENGTH}px; height:${physicalSize.height};` :
            `flex-basis:0; flex-grow:${grow}; height:${physicalSize.height};`;
    } else if (direction == 'column') {
        return grow == 0 ? `width:${physicalSize.width}; height:${matrix.length * UNIT_LENGTH}px;` :
            // 这里的 height:0 是为了解决chrome的bug
            `width:${physicalSize.width}; flex-basis:0; flex-grow:${grow}; height:0;`;
    } else {
        return 'width:100%; height:100%;';
    }
}

function calcGrow(matrix, direction) {
    let grows;
    if (direction == 'row') {
        grows = matrix.map(row => row.reduce((grow, svd) => {
            if (svd && (svd.scaleDirection == 'hor' || svd.scaleDirection == 'both')) {
                grow++;
            }
            return grow;
        }, 0));
    } else if (direction == 'column') {
        grows = [];
        for (let col = 0, columns = matrix[0].length; col < columns; col++) {
            let grow = 0;
            for (let row = 0, rows = matrix.length; row < rows; row++) {
                const svd = matrix[row][col];
                if (!svd) {
                    continue;
                }
                if (svd.scaleDirection == 'ver' || svd.scaleDirection == 'both') {
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
function calcPhysicalSize(matrix) {
    if (containsMultipleBlocks(matrix)) {
        // 包含多个不同块，且不能再切分，我们只能无视其延展性，认为它是固定尺寸
        return {
            width: `${matrix[0].length * UNIT_LENGTH}px`,
            height: `${matrix.length * UNIT_LENGTH}px`
        };
    } else {
        const svd = matrix[0][0];
        const scaleDirection = svd.scaleDirection;
        return {
            width: scaleDirection == 'none' || scaleDirection == 'ver' ?
                `${matrix[0].length * UNIT_LENGTH}px` : '100%',
            height: scaleDirection == 'none' || scaleDirection == 'hor' ?
                `${matrix.length * UNIT_LENGTH}px` : '100%'
        }
    }
}

function toMatrix(svds) {
    let width = 0, height = 0;
    svds.forEach(svd => {
        width = Math.max(svd.left + svd.width, width);
        height = Math.max(svd.top + svd.height, height);
    });
    const matrix = [];
    for (let row = 0; row < height; row++) {
        matrix[row] = [];
        for (let col = 0; col < width; col++) {
            const svd = svds.find(svd => {
                return (row >= svd.top && row < svd.top + svd.height) &&
                    (col >= svd.left && col < svd.left + svd.width);
            });
            matrix[row][col] = svd ? svd : null;
        }
    }
    return matrix;
}


