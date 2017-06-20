export interface IPlainQuestion {
    word: string;
    definitions: Array<{
        definition: string;
        correct: boolean
    }>;
}
