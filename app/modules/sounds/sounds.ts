import {Howl} from 'howler';

export enum ESoundSample {
    BTN_HOVER = 'btn-hover.wav',
    BTN_CLICK = 'btn-click.wav',
    LOGO_FADE_IN = 'logo-fade-in.wav'
}

export default class Sounds {
    private static PATH = './static/snd';
    private static howls: Map<ESoundSample, Promise<Howl>> = new Map();
    private static initPromise: Promise<void>;

    private static mainMusic = new Howl({
        src: `${Sounds.PATH}/main.mp3`,
        loop: true
    });

    private static menuMusic = new Howl({
        src: `${Sounds.PATH}/menu.mp3`,
        loop: true
    });

    public static playMainMusic(): void {
        this.mainMusic.play();
    }

    public static stopMainMusic(): void {
        this.mainMusic.stop();
    }

    public static playMenuMusic(): void {
        this.menuMusic.play();
    }

    public static stopMenuMusic(): void {
        this.menuMusic.stop();
    }

    public static initializeSamples(): Promise<void> {
        this.initPromise = Promise.all(Object.keys(ESoundSample).map((key) => {
            return this.loadSample(ESoundSample[key]);
        })).then(() => {});

        return this.initPromise;
    }

    public static playSound(sample: ESoundSample): void {
        this.howls.get(sample).then((sound) => {
            sound.play();
        });
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