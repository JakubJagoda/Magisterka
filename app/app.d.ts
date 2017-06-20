/// <reference path="third-party/react-typist.d.ts" />

declare const enum GameViews {
    MAIN_MENU,
    QUESTION_PANEL
}

declare const enum UserEvents {
    MAIN_MENU__NEW_GAME_CLICKED,
    QUESTION_PANEL__TRUE_CLICKED,
    QUESTION_PANEL__FALSE_CLICKED
}

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
