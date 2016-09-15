import {IDispatcherAction} from "../flux/dispatcher";

export class SetPlayerNameAction implements IDispatcherAction {
    constructor(public name:string){}
}

export class BeginRoundAction implements IDispatcherAction {
    constructor(public round:number){}
}