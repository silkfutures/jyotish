export const adaptiveQuestions = [
  { id:'lead-project', question:'If you could personally lead only one major project while somebody else operated the others, which one would you keep and why?', reason:'Clarifies your true priority hierarchy.' },
  { id:'money-number', question:'What monthly personal income would make you feel genuinely financially safe?', reason:'Turns financial security into a usable threshold.' },
  { id:'music-audience', question:'What do you want your die-hard music audience to become or do differently because they encountered you?', reason:'Clarifies the deeper purpose of the music.' },
  { id:'rest-signal', question:'How can you tell the difference between genuine exhaustion and avoidance?', reason:'Helps the system distinguish discipline from recovery.' }
];
export function nextQuestion(state) {
  const answered = new Set((state.questionsAnswered || []).map(x => x.id));
  return adaptiveQuestions.find(q => !answered.has(q.id)) || null;
}
