class ImagesPreloader {
    private static readonly IMG_PATH = './static/img';
    private promises: Promise<any>[] = [];

    loadPNGAsset(name: string): void {
        const img = new Image();
        this.promises.push(new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `${ImagesPreloader.IMG_PATH}/${name}.png`;
        }));
    }

    onAllAssetsLoaded(): Promise<any> {
        return Promise.all(this.promises);
    }
}

const IMAGES_LIST = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'correct',
    'high-scores',
    'logo-bunk',
    'logo-or',
    'logo-truth',
    'round',
    'wrong',
    'you-lose',
    'you-won'
];

export function loadPNGAssets(): Promise<any> {
    const preloader = new ImagesPreloader();
    IMAGES_LIST.forEach(name => preloader.loadPNGAsset(name));

    return preloader.onAllAssetsLoaded();
}