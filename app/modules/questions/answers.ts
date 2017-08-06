import * as Api from '../api/api';
import userStore from '../user/userStore';

interface IAnswer {
    contentID: number;
    dateTime?: Date | string;
    answer: boolean;
    correctAnswer: boolean;
    time: number;
    reported: boolean;
}

export interface ISendAnswersPayloadEntry {
    correct_phrase_id: string;
    content_id: number;
    date_time: number;
    phrases: Array<string>;
    answer_phrase_id: string;
    time: number;
    reported: boolean;
}

interface ISendAnswersPhrasesPayloadEntry {
    phrases: Array<number>;
}

const PHRASE_CORRECT_TO_ID = new Map<boolean, string>([[true, '1'], [false, '2']]);
const LOCAL_STORAGE_KEY = 'tgame.answers';

function convertAnswerToPayload(answer:IAnswer): ISendAnswersPayloadEntry {
    return {
        correct_phrase_id: PHRASE_CORRECT_TO_ID.get(answer.correctAnswer),
        content_id: answer.contentID,
        date_time: new Date(answer.dateTime).getTime() / 1000,
        phrases: ['3', '4', PHRASE_CORRECT_TO_ID.get(!answer.correctAnswer)], //what an idiot designed this...
        answer_phrase_id: PHRASE_CORRECT_TO_ID.get(answer.answer),
        time: answer.time,
        reported: answer.reported
    };
}

async function postAnswers(): Promise<any> {
    const storageEntry: IAnswer[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

    if (storageEntry.length < 3) {
        return;
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);

    const payload = storageEntry.map(convertAnswerToPayload);
    return Api.sendAnswers(userStore.getUserData().userID, payload);
}

export function saveAnswer(answer: IAnswer): void {
    answer.dateTime = new Date();

    const storageEntry = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...storageEntry, answer]));

    postAnswers();
}

postAnswers();