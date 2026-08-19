export const adaptiveQuestions=[
 {id:'priority-one',area:'direction',question:'If every project succeeded, which one would make you feel most like you had lived the right life?',reason:'Separates significance from opportunity.'},
 {id:'money-safe',area:'money',question:'What monthly personal income would make you feel safe enough to stop making decisions from scarcity?',reason:'Gives financial decisions a real threshold.'},
 {id:'music-change',area:'music',question:'What do you want someone to become or do differently after following your music for two years?',reason:'Defines the audience relationship beyond follower count.'},
 {id:'rest',area:'body',question:'What are the physical signs that tell you “I need recovery” rather than “I am avoiding discomfort”?',reason:'Builds a personal rule for discipline versus depletion.'},
 {id:'love-baseline',area:'relationships',question:'What three qualities make you feel most peaceful and most yourself in a romantic relationship?',reason:'Creates a grounded compatibility baseline.'},
 {id:'spiritual-test',area:'spirituality',question:'How would you know a spiritual interpretation was helping you see reality more clearly rather than helping you avoid it?',reason:'Creates a reality-check for symbolic thinking.'},
 {id:'childhood',area:'timeline',question:'What are three childhood or teenage turning points you can approximately date?',reason:'Deepens the life model and later helps birth-time rectification.'},
 {id:'success-cost',area:'values',question:'What kind of success would you refuse if the cost was becoming somebody you did not respect?',reason:'Reveals non-negotiables.'}
];

export function nextQuestion(state){
  const answered=new Set((state.questionsAnswered||[]).map(x=>x.id));
  return adaptiveQuestions.find(x=>!answered.has(x.id))||null;
}
