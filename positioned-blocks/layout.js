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
            const layout = { left, top, scaleDirection, width: tmp[0].length, height: tmp.length };
            svds.push({id, layout, htmlCoder});
        });
    });
}

function htmlCoder() {
    return `
        <div style="width:100%; height:100%; background-color:#${colors[random(colors.length-1)]};">
            ${this.id}
        </div>
    `;
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
removeUnslicablesScalability(matrix);
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
        // 无法继续切下去，此时可能是只剩下一块了，也可能剩下多块
        return layoutUnslicable(matrix, sizeAndGrow);
    }

    const flexDirection = !!childDirection ? `flex-direction:${childDirection};` : '';
    let html = `<div style="display:flex; ${flexDirection} ${sizeAndGrow}">\n`;
    blocks.forEach(block => {
        html += layout(block, childDirection) + '\n';
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
                const width = svd.layout.width * UNIT_LENGTH, height = svd.layout.height * UNIT_LENGTH;
                const leftPx = left * UNIT_LENGTH, topPx = top * UNIT_LENGTH;
                const css = `width:${width}px; height:${height}px; left:${leftPx}px; top:${topPx}px;`;
                html += `
                    <div style="position:absolute; ${css}">
                        ${svd.htmlCoder.apply(svd)}
                    </div>
                `;
                processedSvds.push(svd);
            });
        });
        html += `</div>`;
    } else {
        // 只有一块，那就不需要生成绝对布局代码了
        const svd = matrix[0][0];
        html = svd.htmlCoder.apply(svd);
    }
    return `<div style="${sizeAndGrow}">\n${html}\n</div>`;
}

// 将包含多个独立块且无法切分的所有块的响应性去掉
function removeUnslicablesScalability(matrix) {
    const [blocks, ] = slice(matrix);
    if (blocks.length > 1) {
        blocks.forEach(b => removeUnslicablesScalability(b));
        return;
    }
    if (!containsMultipleBlocks(matrix)) {
        return;
    }
    matrix.forEach(row => row.forEach(svd => svd && (svd.layout.scaleDirection = 'none')));
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

function containsMultipleBlocks(matrix) {
    const target = matrix[0][0];
    return matrix.find(row => row.find(id => id !== target));
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
            const scaleDirection = svd.layout.scaleDirection;
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
                const scaleDirection = svd.layout.scaleDirection;
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
        const scaleDirection = svd.layout.scaleDirection;
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
        width = Math.max(svd.layout.left + svd.layout.width, width);
        height = Math.max(svd.layout.top + svd.layout.height, height);
    });
    const matrix = [];
    for (let row = 0; row < height; row++) {
        matrix[row] = [];
        for (let col = 0; col < width; col++) {
            const svd = svds.find(svd => {
                return (row >= svd.layout.top && row < svd.layout.top + svd.layout.height) &&
                    (col >= svd.layout.left && col < svd.layout.left + svd.layout.width);
            });
            matrix[row][col] = svd ? svd : null;
        }
    }
    return matrix;
}


