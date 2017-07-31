import * as Api from '../api/api';
import userStore from '../user/userStore';
import {IPlainQuestion, Question} from './question';

export {Question};

interface IGetDataResponseEntry {
    content: string;
    content_id: string;
    correct_phrase_id: string;
    phrases: Array<{
        phrase: 'Yes' | 'No' | 'Unsure' | 'Skip',
        phrase_id: string;
    }>;
    difficulty: string;
}

interface IAnswer {
    correctPhraseID: number;
    contentID: number;
    dateTime: Date;
    phrases: Array<number>;
    answerPhraseID: number;
    time: Date;
    reported: boolean;
}

export interface ISendAnswersPayloadEntry {
    correct_phrase_id: number;
    content_id: number;
    date_time: number;
    phrases: Array<number>;
    answer_phrase_id: number;
    time: number;
    reported: boolean;
}

interface ISendAnswersPhrasesPayloadEntry {
    phrases: Array<number>;
}

const LOCAL_STORAGE_KEY = 'tgame.questions';
let questionsStorage = new Map<number, Question[]>();

function convertResponseToQuestions(response:IGetDataResponseEntry[]):IPlainQuestion[] {
    return response.map(responseEntry => {
        const {word, definition} = transformContentStringToDefinition(responseEntry.content);

        return {
            contentID: Number(responseEntry.content_id),
            isDefinitionCorrect: responseEntry.correct_phrase_id === '1',
            word,
            definition,
            difficulty: Number(responseEntry.difficulty)
        };
    });
}

function convertAnswerToPayload(answer:IAnswer):ISendAnswersPayloadEntry {
    return {
        correct_phrase_id: answer.correctPhraseID,
        content_id: answer.contentID,
        date_time: answer.dateTime.getTime(),
        phrases: answer.phrases,
        answer_phrase_id: answer.answerPhraseID,
        time: answer.time.getTime(),
        reported: answer.reported
    };
}

export function getQuestion(level: number):Question {
    const questions = questionsStorage.get(level);

    if (!questions) {
        return new Question(); // well, this should never end here
    }

    return questions[Math.floor(Math.random() * questions.length)];
}

async function fetchQuestions():Promise<Question[]> {
    const questionsInStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) as IPlainQuestion[];
    if (questionsInStorage) {
        return questionsInStorage.map(plainQuestion => Question.fromPlainQuestion(plainQuestion));
    }

    return Api.getData(userStore.getUserData().userID, 100).then((response:IGetDataResponseEntry[]) => {
        const mappedResponse = convertResponseToQuestions(response);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mappedResponse));
        return mappedResponse.map(plainQuestion => Question.fromPlainQuestion(plainQuestion));
    });
}

function mapQuestionsToQuestionStorage(questions: Question[]):Map<number, Question[]> {
    return questions.reduce((reduced, question) => {
        const difficulty = question.getDifficulty();

        if (!reduced.has(difficulty)) {
            reduced.set(difficulty, []);
        }

        reduced.set(difficulty, [...reduced.get(difficulty), question]);
        return reduced;
    }, new Map<number, Question[]>());
}

export async function loadInitialQuestionSet():Promise<void> {
    const questions = await fetchQuestions();
    questionsStorage = mapQuestionsToQuestionStorage(questions);
}

export async function postAnswers(playerID: string, answers: IAnswer[]):Promise<any> {
    const payload = answers.map(convertAnswerToPayload);
    return Api.sendAnswers(playerID, payload);
}

function transformContentStringToDefinition(content: string) {
    const [definitionPart, wordPart] = content.split('\n');
    const [, definition] = definitionPart.split(':');
    const [, word] = wordPart.split(':');

    return {
        word,
        definition
    };
}