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

let svds = [];

let source = `
                                                                                                                                                                                                                                                                                                                                                                                                                
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
    a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0  a0      b1  b1  b1  b1  b1  b1  b1  b1  b1  b1  b1          c0  c0  c0  c0  c0  c0  c0  c0  c0      d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1  d1      e0  e0  e0  e0  e0  e0  e0  e0  e0  e0  e0
                                                                                                                                                                                                                                                                                                                                                                                                                
                                            g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
                                            g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
                                            g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
                                            g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
                                            g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
                                            g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0  g0      h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1  h1      i1  i1  i1  i1  i1  i1  i1  i1  i1  i1  i1          j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0  j0          k0  k0  k0  k0  k0  k0  k0  k0  k0  k0  k0
                                                                                                                                                                                                                                                                                                                                                                                                                
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3  r3      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1                                                              q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      n1  n1  n1  n1  n1  n1  n1      s0  s0  s0  s0  s0  s0      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0                                                                  t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
    l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2  l2      m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0  m0      u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1  u1      t2  t2  t2  t2  t2  t2      q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1  q1
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
            const layout = {left, top, scaleDirection, width: tmp[0].length, height: tmp.length};
            svds.push({id, layout, htmlCoder});
        });
    });
}

function htmlCoder() {
    return `
        <div style="width:100%; height:100%; background-color:#${colors[random(colors.length - 1)]};">
            ${this.id}
        </div>
    `;
}

function showHtml(html) {
    document.body.innerHTML = html;
    // console.log(html);
}

function random(max) {
    return Math.round(Math.random() * max)
}

toSvdList(source);
svds.find(svd => svd.id == 't2').layout.height += 6;
// svds.find(svd => svd.id == 'n1').layout.left -= 3;


// svds.push(
//     {id: 'aa', layout: {left: 1, top: 1, width: 4, height: 2}},
//     {id: 'bb', layout: {left: 4, top: 1, width: 2, height: 2}},
//     {id: 'cc', layout: {left: 7, top: 1, width: 4, height: 2}},
//     {id: 'dd', layout: {left: 10, top: 1, width: 2, height: 2}},
//     {id: 'ee', layout: {left: 4, top: 2, width: 5, height: 4}},

//     {id: 'aa1', layout: {left: 13, top: 2, width: 4, height: 2}},
//     {id: 'bb1', layout: {left: 16, top: 2, width: 2, height: 2}},
//     {id: 'cc1', layout: {left: 19, top: 2, width: 4, height: 2}},
//     {id: 'dd1', layout: {left: 22, top: 2, width: 2, height: 2}},
//     {id: 'ee1', layout: {left: 16, top: 3, width: 4, height: 4}},

//     {id: 'ff', layout: {left: 8, top: 5, width: 9, height: 5}},
// );
// svds.forEach(svd => svd.htmlCoder = htmlCoder);

console.log(svds);


// 以上代码实际运行时用不到
///////////////////////////////////////////////////////////


const UNIT_LENGTH = 8;
const html = scalableLayout(svds);

//const html = absoluteLayout(svds, true);
showHtml(html);

function scalableLayout(svds) {
    let copiedSvds = simplifyAndCopy(svds);
    regroupOverlaps(copiedSvds);
    console.log('after regroup:', copiedSvds);
    const matrix = toMatrix(copiedSvds);
    removeUnslicablesScalability(matrix);
    return scalableLayoutDo(matrix);
}

// 无视尺寸的响应性，直接生成绝对布局代码了，无论是否可以再切分的块，都可以采用这个方式布局
function absoluteLayout(svds, keepBorder = false) {
    const copiedSvds = simplifyAndCopy(svds);

    let left = Infinity, top = Infinity;
    if (keepBorder) {
        left = 0;
        top = 0;
    } else {
        copiedSvds.forEach(svd => {
            left = Math.min(svd.left, left);
            top = Math.min(svd.top, top);
        });
    }

    let html = `<div style="position:relative; width:100%; height:100%;">\n`;
    copiedSvds.forEach((svd,index) => {
        html += getAbsoluteDiv(svd, svd.left - left, svd.top - top, svd.width, svd.height,index);
    });
    html += `</div>`;

    return html;
}

function scalableLayoutDo(matrix, direction) {
    const separator = checkSeparator(matrix);
    if (separator) {
        const size = direction == 'column' ?
            `min-height:${separator.height}px; max-height:${separator.height}px;` :
            `min-width:${separator.width}px; max-width:${separator.width}px;`;
        return `<div style="${size}"></div>`;
    }

    const [blocks, childDirection] = slice(matrix);
    const slicable = blocks.length > 1;
    let sizeAndGrow = calcSizeAndGrow(matrix, direction, slicable);

    if (!slicable) {
        // 无法继续切下去，此时可能是只剩下一块了，也可能剩下多块
        return layoutUnslicable(matrix, sizeAndGrow);
    }

    const flexDirection = !!childDirection ? `flex-direction:${childDirection};` : '';
    let html = `<div style="display:flex; ${flexDirection} ${sizeAndGrow}">\n`;
    blocks.forEach(block => {
        html += scalableLayoutDo(block, childDirection) + '\n';
    });
    html += '</div>';
    return html;
}

function layoutUnslicable(matrix, sizeAndGrow) {
    let html;
    if (containsMultipleBlocks(matrix)) {
        // 不止一块，那就无视尺寸的响应性，直接生成绝对布局代码了
        const processedSvds = [];
        html = `<div style="position:relative; width:100%; height:100%;">\n`;
        // 从左到右，从上到下遍历，在某个坐标下每发现一个新的svd，则此坐标必然是该svd的左上角坐标
        matrix.forEach((row, top) => {
            row.forEach((svd, left) => {
                if (!svd || processedSvds.find(s => s === svd)) {
                    return;
                }
                html += getAbsoluteDiv(svd, left, top, svd.width, svd.height,left);
                processedSvds.push(svd);
            });
        });
        html += `</div>`;
    } else {
        // 只有一块，那就不需要生成绝对布局代码了
        const svd = matrix[0][0];
        html = svd.origin.htmlCoder.apply(svd.origin);
    }
    return `<div style="${sizeAndGrow}">\n${html}\n</div>`;
}

// 将包含多个独立块且无法切分的所有块的响应性去掉
function removeUnslicablesScalability(matrix) {
    const [blocks,] = slice(matrix);
    if (blocks.length > 1) {
        blocks.forEach(b => removeUnslicablesScalability(b));
        return;
    }
    if (!containsMultipleBlocks(matrix)) {
        return;
    }
    matrix.forEach(row => row.forEach(svd => svd && (svd.scaleDirection = 'none')));
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
        // 如果能找到这样的一行：它在col处左右两边的值相等，则位置col不是一个边
        const found = matrix.find(row => !!row[col] && row[col] === row[col - 1]);
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
        // 如果能找到这样的一列：它在rowIdx处上下两边的值相等，则位置rowIdx不是一个边
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

function containsMultipleBlocks(matrix) {
    const target = matrix[0][0];
    return matrix.find(row => row.find(svd => svd !== target));
}

function calcSizeAndGrow(matrix, direction, slicable) {
    const grow = calcGrow(matrix, direction, slicable);
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

function calcGrow(matrix, direction, slicable) {
    if (!slicable && containsMultipleBlocks(matrix)) {
        return 0;
    }

    let grows;
    if (direction == 'row') {
        grows = matrix.map(row => row.reduce((grow, svd) => {
            if (!svd) {
                return grow;
            }
            const scaleDirection = svd.scaleDirection;
            if (scaleDirection == 'hor' || scaleDirection == 'both') {
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
                const scaleDirection = svd.scaleDirection;
                if (scaleDirection == 'ver' || scaleDirection == 'both') {
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

function simplifyAndCopy(svds) {
    return svds.map(svd => ({
        left: svd.layout.left, top: svd.layout.top,
        width: svd.layout.width, height: svd.layout.height,
        scaleDirection: svd.layout.scaleDirection, origin: svd
    }));
}

function isInside(row, col, left, top, width, height) {
    return (row >= top && row < height + top) && (col >= left && col < width + left);
}

// 将有重叠的块重新分组，把重叠的块融合成一个大的虚拟块，再按照不重叠的算法来布局
function regroupOverlaps(svds) {
    for (let i = 0, len = svds.length; i < len; i++) {
        if (fixOverlaps(svds[i], svds)) {
            regroupOverlaps(svds);
            break;
        }
    }
}

function fixOverlaps(target, svds) {
    for (let i = 0, len = svds.length; i < len; i++) {
        const svd = svds[i];
        if (svd === target) {
            continue;
        }
        // 算出组合后的区域的尺寸
        let width = Math.max(svd.left + svd.width, target.left + target.width);
        let height = Math.max(svd.top + svd.height, target.top + target.height);
        let count = 0;
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                // 有重叠的地方只会++一次，因此，如果有重叠，则count的数量必然小于2个块的数量之和
                if (isInside(row, col, target.left, target.top, target.width, target.height)) {
                    count++;
                } else if (isInside(row, col, svd.left, svd.top, svd.width, svd.height)) {
                    count++;
                }
            }
        }
        if (count === target.width * target.height + svd.width * svd.height) {
            // 没有重叠
            continue;
        }

        const left = Math.min(svd.left, target.left);
        const top = Math.min(svd.top, target.top);
        width -= left;
        height -= top;
        const scaleDirection = 'none';
        const foundOrigin = svd.origin instanceof Array ? svd.origin : [svd.origin];
        const origin = target.origin instanceof Array ? target.origin : [target.origin];
        origin.push(...foundOrigin);
        origin.htmlCoder = overlapHtmlCoder.bind(origin);
        svds.splice(i, 1, {left, top, width, height, origin, scaleDirection});
        let targetIdx = svds.findIndex(svd => svd === target);
        svds.splice(targetIdx, 1);
        return true;
    }
    return false;
}

function getAbsoluteDiv(svd, left, top, width, height,index) {
    width *= UNIT_LENGTH;
    height *= UNIT_LENGTH;
    left *= UNIT_LENGTH;
    top *= UNIT_LENGTH;
    const css = `width:${width}px; height:${height}px; left:${left}px; top:${top}px;z-index:${index*2+12};display:flex;justify-content:center;align-items:center;`;
    return `
        <div style="position:absolute; ${css}">
            ${svd.origin.htmlCoder.apply(svd.origin)}
        </div>
    `;
}

function overlapHtmlCoder() {
    return absoluteLayout(this);
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
            const svd = svds.find(svd =>
                (row >= svd.top && row < svd.top + svd.height) &&
                (col >= svd.left && col < svd.left + svd.width));
            matrix[row][col] = svd ? svd : null;
        }
    }
    return matrix;
}


