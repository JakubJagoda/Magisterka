import {IPlainQuestion} from "./questions";
const questions = require<IPlainQuestion[]>('./questions.json');

export default class Question {
    private word: string;
    private definition: string;
    private isDefinitionCorrect: boolean;

    static getQuestion(difficulty:number = 0):Question {
        const plainQuestion = questions[Math.floor(Math.random() * questions.length)];
        return Question.fromPlainQuestion(plainQuestion);
    }

    private static fromPlainQuestion(plainQuestion:IPlainQuestion):Question {
        const question = new Question();
        const selectedDefinition = plainQuestion.definitions[Math.floor(Math.random() * plainQuestion.definitions.length)];
        question.word = plainQuestion.word;
        question.definition = selectedDefinition.definition;
        question.isDefinitionCorrect = selectedDefinition.correct;

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
