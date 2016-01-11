import Question from '../questions/question';

export default class Round {
    private questionNumber:number;
    private currentQuestion:Question;

    constructor(private minimalBet:number) {
        this.setQuestionNumber(0);
    }

    getNextQuestion():Question {
        this.questionNumber++;
        this.currentQuestion = Question.getQuestion();
        return this.currentQuestion;
    }

    getQuestionNumber():number {
        return this.questionNumber;
    }

    setQuestionNumber(questionNumber:number) {
        this.questionNumber = questionNumber;
    }

    getCurrentQuestion():Question {
        return this.currentQuestion;
    }
}
