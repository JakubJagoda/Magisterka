import * as Questions from './questions';
import * as Answers from './answers';

export {Question} from './questions';
export {Answer, ISendAnswersPayloadEntry} from './answers';

export function getQuestion(level: number): Questions.Question {
    return Questions.getQuestion(level);
}

export async function loadInitialQuestionSet():Promise<void> {
    return Questions.loadInitialQuestionSet();
}

export function saveAnswer(answer: Answers.Answer) {
    Answers.saveAnswer(answer);
}