import * as Flux from 'flux';

export enum PayloadSource {
    Server,
    View
}

export interface IDispatcherAction {
}

export interface IDispatcherHandlerPayload {
    action:IDispatcherAction;
}

export interface IDispatcherPayload extends IDispatcherHandlerPayload {
    source:PayloadSource;
}

class Dispatcher extends Flux.Dispatcher<IDispatcherPayload> {
    private log(payload:IDispatcherPayload) {
        console.log(
            new Date(),
            PayloadSource[payload.source],
            payload.action
        );
    }

    public handleViewAction(payload:IDispatcherHandlerPayload):void {
        const dispatcherPayload:IDispatcherPayload = {
            action: payload.action,
            source: PayloadSource.View
        };
        this.log(dispatcherPayload);
        super.dispatch(dispatcherPayload);
    }

    public handleServerAction(payload:IDispatcherHandlerPayload):void {
        const dispatcherPayload:IDispatcherPayload = {
            action: payload.action,
            source: PayloadSource.Server
        };
        this.log(dispatcherPayload);
        super.dispatch(dispatcherPayload);
    }

    /**
     * @deprecated
     * @param payload
     */
    public dispatch(payload:any):void {
        throw new Error('Usage of dispatch directly is forbidden. Use handleViewAction or handleServerAction instead.');
    }
}

const dispatcher = new Dispatcher();
export default dispatcher;