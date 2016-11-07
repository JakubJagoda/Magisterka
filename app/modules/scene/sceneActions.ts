import {IDispatcherAction} from "../flux/dispatcher";

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
    constructor(public answer: boolean) {
    }
}

export class QuestionResultShown implements IDispatcherAction {
    constructor() {
    }
}

export class FinalScoreShown implements IDispatcherAction {
    constructor() {
    }
}