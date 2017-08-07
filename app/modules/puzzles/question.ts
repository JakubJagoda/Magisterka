export interface IPlainQuestion {
    contentID: number;
    isDefinitionCorrect: boolean;
    word: string;
    definition: string;
    difficulty: number;
}

export class Question {
    private word: string;
    private definition: string;
    private isDefinitionCorrect: boolean;
    private difficulty: number;
    private contentID: number;

    public static fromPlainQuestion(plainQuestion:IPlainQuestion): Question {
        const question = new Question();
        question.word = plainQuestion.word;
        question.definition = plainQuestion.definition;
        question.isDefinitionCorrect = plainQuestion.isDefinitionCorrect;
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

    getIsDefinitionCorrect(): boolean {
        return this.isDefinitionCorrect;
    }

    getDifficulty(): number {
        return this.difficulty;
    }

    getContentID(): number {
        return this.contentID;
    }
}
