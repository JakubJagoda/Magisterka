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

const PHRASE_CORRECT_TO_ID = new Map<boolean, string>([[true, '1'], [false, '2']]);
const LOCAL_STORAGE_KEY = 'tgame.answers';
const MAX_ANSWERS_STORED = 10;

function convertAnswerToPayload(answer:IPlainAnswer): ISendAnswersPayloadEntry {
    return {
        correct_phrase_id: PHRASE_CORRECT_TO_ID.get(answer.correctAnswer),
        content_id: answer.contentID,
        date_time: new Date(answer.dateTime).getTime() / 1000,
        phrases: ['3', '4', PHRASE_CORRECT_TO_ID.get(!answer.correctAnswer)], //what an idiot designed this...
        answer_phrase_id: PHRASE_CORRECT_TO_ID.get(answer.selectedAnswer),
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
    return Api.sendAnswers(userStore.getUserData().userID, payload);
}

export function saveAnswer(answer: Answer): void {
    const storageEntry = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...storageEntry, answer]));

    postAnswersIfEnoughSaved().catch(e => console.error(e));
}