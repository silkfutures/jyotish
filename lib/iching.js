const trigramBits = {
  '111':'Qian', '110':'Dui', '101':'Li', '100':'Zhen',
  '011':'Xun', '010':'Kan', '001':'Gen', '000':'Kun'
};
const order = ['Qian','Dui','Li','Zhen','Xun','Kan','Gen','Kun'];
const matrix = [
  [1,10,13,25,44,6,33,12],
  [43,58,49,17,28,47,31,45],
  [14,38,30,21,50,64,56,35],
  [34,54,55,51,32,40,62,16],
  [9,61,37,42,57,59,53,20],
  [5,60,63,3,48,29,39,8],
  [26,41,22,27,18,4,52,23],
  [11,19,36,24,46,7,15,2]
];
const names = {
1:'The Creative',2:'The Receptive',3:'Difficulty at the Beginning',4:'Youthful Folly',5:'Waiting',6:'Conflict',7:'The Army',8:'Holding Together',9:'Small Taming',10:'Treading',11:'Peace',12:'Standstill',13:'Fellowship',14:'Great Possession',15:'Modesty',16:'Enthusiasm',17:'Following',18:'Work on What Has Been Spoiled',19:'Approach',20:'Contemplation',21:'Biting Through',22:'Grace',23:'Splitting Apart',24:'Return',25:'Innocence',26:'Great Taming',27:'Nourishment',28:'Great Exceeding',29:'The Abysmal',30:'The Clinging',31:'Influence',32:'Duration',33:'Retreat',34:'Great Power',35:'Progress',36:'Darkening of the Light',37:'The Family',38:'Opposition',39:'Obstruction',40:'Deliverance',41:'Decrease',42:'Increase',43:'Breakthrough',44:'Coming to Meet',45:'Gathering Together',46:'Pushing Upward',47:'Oppression',48:'The Well',49:'Revolution',50:'The Cauldron',51:'The Arousing',52:'Keeping Still',53:'Development',54:'The Marrying Maiden',55:'Abundance',56:'The Wanderer',57:'The Gentle',58:'The Joyous',59:'Dispersion',60:'Limitation',61:'Inner Truth',62:'Small Exceeding',63:'After Completion',64:'Before Completion'
};

function numFor(lines) {
  const bits = lines.map(v => (v === 7 || v === 9) ? '1' : '0');
  const lower = trigramBits[bits.slice(0,3).join('')];
  const upper = trigramBits[bits.slice(3,6).join('')];
  return matrix[order.indexOf(upper)][order.indexOf(lower)];
}

export function castIChing() {
  const lines = Array.from({length:6}, () => {
    const coins = Array.from({length:3}, () => Math.random() < 0.5 ? 2 : 3);
    return coins.reduce((a,b)=>a+b,0);
  });
  const changed = lines.map(v => v === 6 ? 7 : v === 9 ? 8 : v);
  const primary = numFor(lines);
  const relating = numFor(changed);
  const moving = lines.map((v,i)=> (v===6 || v===9) ? i+1 : null).filter(Boolean);
  return {
    method: 'three-coin',
    lineOrder: 'bottom-up',
    lines,
    primary,
    primaryName:names[primary],
    relating,
    relatingName:names[relating],
    moving,
    createdAt: new Date().toISOString()
  };
}

export function lineGlyph(v){
  return (v===7 || v===9) ? '━━━━━━' : '━━  ━━';
}
