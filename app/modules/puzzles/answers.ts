import * as Api from '../api/api';
import userStore from '../user/userStore';
import {Answer, IPlainAnswer} from './answer';

export {Answer, IPlainAnswer};

export interface ISendAnswersPayloadEntry {
    correct_phrase_id: string;
    content_id: number;
    date_time: number;
    phrases: Array<string>;
    answer_phrase_id: string;
    time: number;
    reported: boolean;
}

export enum EAnswerType {
    TRUTH = '1',
    BUNK = '2',
    SKIP = '3', // unused in the game
    UNSURE = '4', // unused in the game
    TIMEOUT = '5' // unused in original TGame
}

const LOCAL_STORAGE_KEY = 'tgame.answers';
const MAX_ANSWERS_STORED = 10;

function convertAnswerToPayload(answer:IPlainAnswer): ISendAnswersPayloadEntry {
    const remainingAnswerPhraseID = answer.correctAnswer === EAnswerType.TRUTH ? EAnswerType.BUNK : EAnswerType.TRUTH;

    return {
        correct_phrase_id: answer.correctAnswer,
        content_id: answer.contentID,
        date_time: new Date(answer.dateTime).getTime() / 1000,
        phrases: [EAnswerType.SKIP, EAnswerType.UNSURE, remainingAnswerPhraseID], //what an idiot designed this...
        answer_phrase_id: answer.selectedAnswer,
        time: answer.timeForAnswerInMs,
        reported: answer.reported
    };
}

async function postAnswersIfEnoughSaved(): Promise<any> {
    const storageEntry: IPlainAnswer[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

    if (storageEntry.length < MAX_ANSWERS_STORED) {
        return;
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);

    const payload = storageEntry.map(convertAnswerToPayload);
    return Api.sendAnswers(userStore.getUserData().deviceID, payload);
}

export function saveAnswer(answer: Answer): void {
    const storageEntry = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...storageEntry, answer]));

    postAnswersIfEnoughSaved().catch(e => console.error(e));
}

export function reportAnswer(answerID: string): void {
    const storageEntry = <IPlainAnswer[]>JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const answer = storageEntry.find(answer => answer.answerID === answerID);

    if (answer) {
        answer.reported = true;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storageEntry));
    }
}