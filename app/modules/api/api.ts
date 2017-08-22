import * as QueryString from 'query-string';
import {ISendAnswersPayloadEntry} from "../puzzles/answers";
import {API_URL} from "constants";

const API_ENDPOINT = `${API_URL}/api.php?o=`;
const VERSION = '1.0.4';

interface IRegisterUserParams {
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ILoginUserParams {
    login: string;
    password: string;
}

interface ILoginUserResponse {
    id: string;
    login: string;
    avatar: string;
}

interface ISendStatsPayload {
    stats: {
        money: number;
    };
}

export interface IHighScoresEntry {
    name: string;
    score: number;
}

export interface IHighScoresResponse {
    single: IHighScoresEntry[];
    total: IHighScoresEntry[];
}

type OperationTypes = 'register' | 'getdata' | 'sendanswers' | 'sendstats' |'getstats' | 'login' | 'register_user' | 'sendtobstats' | 'gettobhighscores';

export async function registerUser({login, email, password, confirmPassword: confirm_password}: IRegisterUserParams) {
    return postToApi('register_user', {
        login,
        email,
        password,
        confirm_password
    });
}

export async function loginUser({login, password}: ILoginUserParams): Promise<ILoginUserResponse> {
    return postToApi('login', {login, password});
}

export async function registerDevice(name: string) {
    return postToApi('register', {
        name,
        version: VERSION
    });
}

export async function getData(playerID: string, limit: number, difficulty: number = null) {
    return postToApi('getdata', {
        player_id: playerID,
        version: VERSION,
        limit,
        difficulty
    });
}

export async function sendAnswers(playerID: string, answers: ISendAnswersPayloadEntry[]) {
    return postToApi('sendanswers', {
        player_id: playerID,
        data: JSON.stringify(answers),
        version: VERSION
    });
}

export async function sendStats(playerID: string, stats: ISendStatsPayload) {
    return postToApi('sendtobstats', {
        player_id: playerID,
        data: JSON.stringify(stats),
        version: VERSION
    });
}

export async function getHighScores(): Promise<IHighScoresResponse> {
    return getFromApi('gettobhighscores');
}

function postToApi(operation: OperationTypes, data: {[key: string]: any}) {
    const formData = new FormData();

    Object.keys(data).forEach(key => formData.append(key, data[key]));

    return fetch(`${API_ENDPOINT}${operation}`, {
        method: 'POST',
        body: formData
    }).then(readResponse);
}

function getFromApi(operation: OperationTypes, params?: {[key: string]: any}) {
    let queryParams = QueryString.stringify(params);

    if (queryParams) {
        queryParams = `?${queryParams}`;
    }

    return fetch(`${API_ENDPOINT}${operation}${queryParams}`, {
        method: 'GET',
    }).then(readResponse);
}

async function readResponse(response:Response) {
    const responseText = await response.text();

    if (response.status !== 200 || responseText.startsWith('Error: ')) {
        //yeah, don't ask me, someone decided it's a good idea to return 200 for errors and distinguish them by the text "Error: "
        console.error(responseText);
        return Promise.reject(new Error(responseText));
    }

    let returnValue;
    try {
        returnValue = JSON.parse(responseText);
    } catch (e) {
        returnValue = responseText;
    }

    return returnValue;
}