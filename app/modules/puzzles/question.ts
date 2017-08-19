import {EAnswerType} from "./answers";

export interface IPlainQuestion {
    contentID: number;
    correctAnswer: EAnswerType;
    word: string;
    definition: string;
    difficulty: number;
}

export class Question {
    private word: string;
    private definition: string;
    private correctAnswer: EAnswerType;
    private difficulty: number;
    private contentID: number;

    public static fromPlainQuestion(plainQuestion:IPlainQuestion): Question {
        const question = new Question();
        question.word = plainQuestion.word;
        question.definition = plainQuestion.definition;
        question.correctAnswer = plainQuestion.correctAnswer;
        question.difficulty = plainQuestion.difficulty;
        question.contentID = plainQuestion.contentID;

        return question;
    }

    getWord(): string {
        return this.word;
    }

    getDefinition(): string {
        return this.definition;
    }

    getDifficulty(): number {
        return this.difficulty;
    }

    getContentID(): number {
        return this.contentID;
    }

    getCorrectAnswer(): EAnswerType {
        return this.correctAnswer;
    }
}
