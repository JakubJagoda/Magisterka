export interface IPlainAnswer {
    contentID: number;
    selectedAnswer: boolean;
    correctAnswer: boolean;
    reported: boolean;
    timeForAnswerInMs: number;
    dateTime: Date;
}

export class Answer {
    private contentID: number;
    private selectedAnswer: boolean;
    private correctAnswer: boolean;
    private reported: boolean;
    private timeForAnswerInMs: number;
    private dateTime: Date;

    public static fromPlainAnswer(plainAnswer:IPlainAnswer): Answer{
        const answer = new Answer();
        answer.contentID = plainAnswer.contentID;
        answer.selectedAnswer = plainAnswer.selectedAnswer;
        answer.correctAnswer = plainAnswer.correctAnswer;
        answer.reported = plainAnswer.reported;
        answer.timeForAnswerInMs = plainAnswer.timeForAnswerInMs;
        answer.dateTime = plainAnswer.dateTime;

        return answer;
    }

    public getContentID() {
        return this.contentID;
    }
}
