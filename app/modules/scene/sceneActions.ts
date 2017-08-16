import {IDispatcherAction} from "../flux/dispatcher";
import {EAnswerType} from '../questionPanel/questionPanel';

export class SetPlayerNameAction implements IDispatcherAction {
    constructor(public name: string) {
    }
}

export class BeginRoundAction implements IDispatcherAction {
    constructor(public round: number) {
    }
}

export class RequestForBetAction implements IDispatcherAction {
    constructor() {
    }
}

export class PlaceBetAction implements IDispatcherAction {
    constructor(public bet: number) {
    }
}

export class AnswerQuestionAction implements IDispatcherAction {
    constructor(public answer: EAnswerType) {
    }
}

export class QuestionResultShownAction implements IDispatcherAction {
    constructor() {
    }
}

export class FinalScoreShownAction implements IDispatcherAction {
    constructor() {
    }
}

export class QuestionsLoadedAction implements IDispatcherAction {
    constructor(){}
}

export class QuestionShownAction implements IDispatcherAction {
    constructor(){}
}

export class QuestionTimeoutAction implements IDispatcherAction {
    constructor(){}
}