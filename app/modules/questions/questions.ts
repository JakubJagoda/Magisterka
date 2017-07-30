import * as Api from '../api/api';
import userStore from '../user/userStore';
import {IPlainQuestion, Question} from './question';

export {Question};

const LOCAL_STORAGE_KEY = 'tgame.questions';

interface IGetDataResponseEntry {
    content: string;
    content_id: string;
    correct_phrase_id: string;
    phrases: Array<{
        phrase: 'Yes' | 'No' | 'Unsure' | 'Skip',
        phrase_id: string;
    }>;
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

function convertResponseToQuestions(response:IGetDataResponseEntry[]):IPlainQuestion[] {
    return response.map(responseEntry => {
        const {word, definition} = transformContentStringToDefinition(responseEntry.content);

        return {
            contentID: Number(responseEntry.content_id),
            isDefinitionCorrect: responseEntry.correct_phrase_id === '1',
            word,
            definition
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

export async function getQuestions():Promise<Question[]> {
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