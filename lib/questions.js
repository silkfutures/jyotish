export const adaptiveQuestions=[
{id:'lead-project',question:'If you eventually had to personally lead only one of your major projects while somebody else operated the others, which one would you keep and why?',reason:'Clarifies your real purpose hierarchy.'},
{id:'money-number',question:'What monthly personal income would make you feel genuinely financially safe rather than merely surviving?',reason:'Turns financial security into a usable decision threshold.'},
{id:'music-audience',question:'What do you want your die-hard music audience to become or do differently because they encountered you?',reason:'Clarifies the deeper purpose of audience growth.'},
{id:'relationship-safety',question:'What three qualities make you feel safest and most yourself in a romantic relationship?',reason:'Creates a compatibility baseline beyond chemistry and symbolism.'},
{id:'rest-signal',question:'How can you tell, in your body and behaviour, the difference between genuine exhaustion and avoidance?',reason:'Helps separate recovery from discipline problems.'},
{id:'spiritual-test',question:'What would count as evidence that a spiritual interpretation is helping you rather than helping you avoid a practical decision?',reason:'Builds a reality-check into symbolic interpretation.'},
{id:'childhood-turning',question:'What are three major childhood or teenage turning points you can approximately date?',reason:'Improves the life timeline and later birth-time rectification.'}
];
export function nextQuestion(state){const answered=new Set((state.questionsAnswered||[]).map(x=>x.id));return adaptiveQuestions.find(q=>!answered.has(q.id))||null}
