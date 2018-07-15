import {Howl} from 'howler';

export enum ESoundSample {
    BTN_HOVER = 'btn-hover.wav',
    BTN_CLICK = 'btn-click.wav',
    LOGO_FADE_IN = 'logo-fade-in.wav',
    CHARACTER_TYPED = 'character-typed.wav',
    SWOOSH = 'swoosh.wav',
    CORRECT_ANSWER = 'correct.mp3',
    WRONG_ANSWER = 'wrong.mp3',
    TICK = 'tick.wav',
    TICK_REVERB = 'tick-reverb.wav'
}

export interface SoundsOptions {
    callback?: Function;
    volume?: number;
}

export default class Sounds {
    private static PATH = './static/snd';
    private static howls: Map<ESoundSample, Promise<Howl>> = new Map();
    private static initPromise: Promise<void>;
    private static muted: boolean = false;

    private static mainMusic = new Howl({
        src: `${Sounds.PATH}/main.mp3`,
        loop: true
    });

    private static menuMusic = new Howl({
        src: `${Sounds.PATH}/menu.mp3`,
        loop: true
    });

    public static playMainMusic(): void {
        this.mainMusic.volume(1);
        this.mainMusic.play();
    }

    public static stopMainMusic(): void {
        this.mainMusic.fade(1, 0, 300);
        setTimeout(() => {
            this.mainMusic.stop();
        }, 300);
    }

    public static playMenuMusic(): void {
        this.menuMusic.volume(1);
        this.menuMusic.play();
    }

    public static stopMenuMusic(): void {
        this.menuMusic.fade(1, 0, 300);
        setTimeout(() => {
            this.menuMusic.stop();
        }, 300);
    }

    public static initializeSamples(): Promise<void> {
        this.initPromise = Promise.all(Object.keys(ESoundSample).map((key) => {
            return this.loadSample(ESoundSample[key]);
        })).then(() => {
        });

        return this.initPromise;
    }

    public static playSound(sample: ESoundSample, opts: SoundsOptions = {}): void {
        this.howls.get(sample).then((sound: Howl) => {
            if (typeof opts.callback === 'function') {
                sound.once('end', opts.callback);
            }

            if (!this.muted) {
                const volume = opts.hasOwnProperty('volume') ? opts.volume : 1;
                sound.volume(volume);
                sound.play();
            }
        });
    }

    public static mute(): void {
        this.muted = true;
        this.mainMusic.mute(true);
        this.menuMusic.mute(true);
    }

    public static unmute(): void {
        this.muted = false;
        this.mainMusic.mute(false);
        this.menuMusic.mute(false);
    }

    private static loadSample(sample: ESoundSample): Promise<Howl> {
        const sound = new Howl({
            src: `${Sounds.PATH}/${sample}`
        });
        const soundLoader: Promise<Howl> = new Promise((resolve, reject) => {
            sound.once('load', () => {
                resolve(sound);
            });

            sound.on('loaderror', () => {
                reject();
            })
        });

        this.howls.set(sample, soundLoader);

        return soundLoader;
    }
}