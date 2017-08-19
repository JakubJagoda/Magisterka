import {EAnswerType} from "./answers";

export interface IPlainAnswer {
    answerID?: string;
    contentID: number;
    selectedAnswer: EAnswerType;
    correctAnswer: EAnswerType;
    reported: boolean;
    timeForAnswerInMs: number;
    dateTime: Date;
}

export class Answer {
    private answerID: string;
    private contentID: number;
    private selectedAnswer: EAnswerType;
    private correctAnswer: EAnswerType;
    private reported: boolean;
    private timeForAnswerInMs: number;
    private dateTime: Date;

    constructor() {
        this.answerID = String(Math.random()).split('.')[1];
    }

    public static fromPlainAnswer(plainAnswer:IPlainAnswer): Answer{
        const answer = new Answer();

        if (plainAnswer.answerID) {
            answer.answerID = plainAnswer.answerID;
        }

        answer.contentID = plainAnswer.contentID;
        answer.selectedAnswer = plainAnswer.selectedAnswer;
        answer.correctAnswer = plainAnswer.correctAnswer;
        answer.reported = plainAnswer.reported;
        answer.timeForAnswerInMs = plainAnswer.timeForAnswerInMs;
        answer.dateTime = plainAnswer.dateTime;

        return answer;
    }

    public getAnswerID() {
        return this.answerID;
    }

    public getContentID() {
        return this.contentID;
    }

    public getSelectedAnswer() {
        return this.selectedAnswer;
    }

    public getCorrectAnswer() {
        return this.correctAnswer;
    }

    public setReported() {
        this.reported = true;
    }
}
