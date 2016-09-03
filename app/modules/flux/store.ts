import Dispatcher from './dispatcher';
import EventListener from './../eventListener/eventListener';
import {IDispatcherPayload} from "./dispatcher";

abstract class Store extends EventListener {
    protected changeEvent = 'CHANGE';
    protected changed:boolean;
    protected className:string;

    private dispatchToken:string;

    private dispatcher:Dispatcher;

    public addListener(callback:(eventType?:string) => void) {
        return this.on(this.changeEvent, callback);
    }

    public removeListener(callback:(eventType?:string) => void) {
        return this.off(this.changeEvent, callback);
    }

    public getDispatcher():Dispatcher {
        return this.dispatcher;
    }

    public getDispatchToken():string {
        return this.dispatchToken;
    }

    public hasChanged():boolean {
        if (!this.dispatcher.isDispatching()) {
            throw new Error(`${this.className}.hasChanged(): Must be invoked while dispatching.`);
        }
        return this.changed;
    }

    protected emitChange():void {
        if (!this.dispatcher.isDispatching()) {
            throw new Error(`${this.className}.emitChange(): Must be invoked while dispatching.`);
        }
        this.changed = true;
    }

    protected invokeOnDispatch(payload:IDispatcherPayload):void {
        this.changed = false;
        this.onDispatch(payload);
        if (this.changed) {
            this.dispatch(this.changeEvent);
        }
    }

    protected abstract onDispatch(payload:IDispatcherPayload):void;

    constructor() {
        this.changed = false;
        this.className = this.constructor.name;
        this.dispatcher = new Dispatcher();
        this.dispatchToken = this.dispatcher.register(payload => {
            this.invokeOnDispatch(payload);
        });
    }
}