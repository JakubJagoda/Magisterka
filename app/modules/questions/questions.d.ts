interface IPlainQuestion {
    word: string;
    definitions: Array<{
        definition: string;
        correct: boolean
    }>;
}

declare module 'json!./questions.json' {
    var q: IPlainQuestion[];
    export default q;
}
