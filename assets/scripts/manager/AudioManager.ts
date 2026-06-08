import { _decorator, Component, AudioSource, AudioClip, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    public static instance: AudioManager = null;

    @property(AudioSource) bgmSource: AudioSource = null;
    @property(AudioSource) sfxSource: AudioSource = null;

    @property(AudioClip) clipClick: AudioClip = null;
    @property(AudioClip) clipFly: AudioClip = null;
    @property(AudioClip) clipPoint: AudioClip = null;
    @property(AudioClip) clipHit: AudioClip = null;
    @property(AudioClip) clipDie: AudioClip = null;
    @property(AudioClip) clipTheme: AudioClip = null;

    private _musicEnabled: boolean = true;
    private _soundEnabled: boolean = true;

    get musicEnabled(): boolean {
        return this._musicEnabled;
    }

    get soundEnabled(): boolean {
        return this._soundEnabled;
    }

    onLoad() {
        if (AudioManager.instance === null) {
            AudioManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        // Load settings
        const storedMusic = sys.localStorage.getItem('flappy_music_enabled');
        this._musicEnabled = storedMusic !== 'false'; // defaults to true

        const storedSound = sys.localStorage.getItem('flappy_sound_enabled');
        this._soundEnabled = storedSound !== 'false'; // defaults to true
    }

    start() {
        if (this._musicEnabled) {
            this.playBGM();
        }
    }

    public toggleMusic(): boolean {
        this._musicEnabled = !this._musicEnabled;
        sys.localStorage.setItem('flappy_music_enabled', this._musicEnabled ? 'true' : 'false');
        
        if (this._musicEnabled) {
            this.playBGM();
        } else {
            this.stopBGM();
        }
        return this._musicEnabled;
    }

    public toggleSound(): boolean {
        this._soundEnabled = !this._soundEnabled;
        sys.localStorage.setItem('flappy_sound_enabled', this._soundEnabled ? 'true' : 'false');
        return this._soundEnabled;
    }

    public playBGM() {
        if (!this._musicEnabled || !this.bgmSource || !this.clipTheme) return;
        this.bgmSource.clip = this.clipTheme;
        this.bgmSource.loop = true;
        this.bgmSource.play();
    }

    public stopBGM() {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }

    public playClick() {
        this.playSFX(this.clipClick);
    }

    public playFly() {
        this.playSFX(this.clipFly);
    }

    public playPoint() {
        this.playSFX(this.clipPoint);
    }

    public playHit() {
        this.playSFX(this.clipHit);
    }

    public playDie() {
        this.playSFX(this.clipDie);
    }

    private playSFX(clip: AudioClip) {
        if (!this._soundEnabled || !this.sfxSource || !clip) return;
        this.sfxSource.playOneShot(clip, 1.0);
    }
}
