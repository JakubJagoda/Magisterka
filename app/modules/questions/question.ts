export interface IPlainQuestion {
    contentID: number;
    isDefinitionCorrect: boolean;
    word: string;
    definition: string;
}

export class Question {
    private word: string;
    private definition: string;
    private isDefinitionCorrect: boolean;

    public static fromPlainQuestion(plainQuestion:IPlainQuestion):Question {
        const question = new Question();
        question.word = plainQuestion.word;
        question.definition = plainQuestion.definition;
        question.isDefinitionCorrect = plainQuestion.isDefinitionCorrect;

        return question;
    }

    getWord():string {
        return this.word;
    }

    getDefinition():string {
        return this.definition;
    }

    getIsDefinitionCorrect():boolean {
        return this.isDefinitionCorrect;
    }
}
