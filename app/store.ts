import * as Redux from "redux";

import gameReducer from './modules/game/gameReducer';
import questionReducer from './modules/questions/questionReducer';

const rootReducer = Redux.combineReducers<IAppState>({
    gameDetails: gameReducer,
    currentQuestion: questionReducer
});

const Store = Redux.createStore(rootReducer);

export default Store;
