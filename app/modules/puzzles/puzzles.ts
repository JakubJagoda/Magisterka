import * as Questions from './questions';
import * as Answers from './answers';

export {Question} from './questions';
export {Answer, ISendAnswersPayloadEntry} from './answers';

export function getQuestion(level: number): Questions.Question {
    return Questions.getQuestion(level);
}

export function getDifficultyLevelsWithNoQuestionsLeft(): number[] {
    return Questions.getDifficultyLevelsWithNoQuestionsLeft();
}

export async function loadInitialQuestionSet():Promise<void> {
    return Questions.loadInitialQuestionSet();
}

export async function loadQuestions(level: number): Promise<void> {
    return Questions.loadQuestions(level);
}

export function saveAnswer(answer: Answers.Answer) {
    Questions.questionAnswered(answer.getContentID());
    Answers.saveAnswer(answer);
}