import * as Api from '../api/api';
import userStore from '../user/userStore';
import {IPlainQuestion, Question} from './question';

export {Question};

interface IInternalPlainQuestion extends IPlainQuestion {
    timesSelected: number;
}

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

const LOCAL_STORAGE_KEY = 'tgame.questions';
const PHRASE_ID_TO_CORRECT = {
    '1': true,
    '2': false
};
let questionsStorage = new Map<number, IInternalPlainQuestion[]>();

function convertResponseToPlainQuestions(response:IGetDataResponseEntry[]):IPlainQuestion[] {
    return response.map(responseEntry => {
        const {word, definition} = transformContentStringToDefinition(responseEntry.content);

        return {
            contentID: Number(responseEntry.content_id),
            isDefinitionCorrect: PHRASE_ID_TO_CORRECT[responseEntry.correct_phrase_id],
            word,
            definition,
            difficulty: Number(responseEntry.difficulty)
        };
    });
}

export function getQuestion(level: number):Question {
    const questions = questionsStorage.get(level);

    if (!questions) {
        return new Question(); // well, this should never end here
    }

    const minTimesSelected = questions.reduce((currentMin, question) => {
        return Math.min(currentMin, question.timesSelected);
    }, Infinity);
    const highestChanceQuestions = questions.filter(question => question.timesSelected === minTimesSelected);
    const selectedQuestion = highestChanceQuestions[Math.floor(Math.random() * highestChanceQuestions.length)];

    if (!selectedQuestion) {
        return new Question(); // well, this should never end here
    }

    selectedQuestion.timesSelected++;
    saveQuestionsStorage();

    return Question.fromPlainQuestion(selectedQuestion);
}

async function fetchQuestions():Promise<IInternalPlainQuestion[]> {
    const questionsInStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) as IInternalPlainQuestion[];
    if (questionsInStorage) {
        return questionsInStorage;
    }

    return Api.getData(userStore.getUserData().userID, 100).then((response:IGetDataResponseEntry[]) => {
        const mappedResponse = convertResponseToPlainQuestions(response).map(plainQuestion => {
            return Object.assign({}, plainQuestion, {timesSelected: 0});
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mappedResponse));
        return mappedResponse;
    });
}

function mapQuestionsToQuestionStorage(questions: IInternalPlainQuestion[]):Map<number, IInternalPlainQuestion[]> {
    return questions.reduce((reduced, internalQuestion) => {
        const difficulty = internalQuestion.difficulty;

        if (!reduced.has(difficulty)) {
            reduced.set(difficulty, []);
        }

        reduced.set(difficulty, [...reduced.get(difficulty), internalQuestion]);
        return reduced;
    }, new Map<number, IInternalPlainQuestion[]>());
}

export async function loadInitialQuestionSet():Promise<void> {
    const questions = await fetchQuestions();
    questionsStorage = mapQuestionsToQuestionStorage(questions);
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

function saveQuestionsStorage() {
    const flattened = ([...questionsStorage.values()] as IInternalPlainQuestion[][]).reduce((reduced, questionStorageEntry) => {
        return [...reduced, ...questionStorageEntry];
    }, []);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(flattened));
}