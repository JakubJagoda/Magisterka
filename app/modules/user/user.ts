import * as Api from '../api/api';
import userStore from './userStore';

export default class User {
    private static postedScores: string[] = [];

    public static async postScores(gameID: string, money: number): Promise<void> {
        if (User.postedScores.includes(gameID) || userStore.getUserData().userID === "") {
            return Promise.resolve();
        }

        User.postedScores.push(gameID);

        const userID = userStore.getUserData().userID;
        const payload = {
            stats: {
                money
            }
        };

        return Api.sendStats(userID, payload);
    }
}