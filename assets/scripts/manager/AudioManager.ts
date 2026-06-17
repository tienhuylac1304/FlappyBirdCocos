import {
  _decorator,
  Component,
  AudioSource,
  AudioClip,
  sys,
  director,
} from "cc";

import { EventManager } from "./EventManager";
import { AudioType, AudioEvent } from "./AudioEnum";

const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Component {
  public static instance: AudioManager = null;

  @property(AudioSource)
  bgmSource: AudioSource = null!;

  @property(AudioSource)
  sfxSource: AudioSource = null!;

  @property(AudioClip)
  clipClick: AudioClip = null!;

  @property(AudioClip)
  clipFly: AudioClip = null!;

  @property(AudioClip)
  clipPoint: AudioClip = null!;

  @property(AudioClip)
  clipHit: AudioClip = null!;

  @property(AudioClip)
  clipDie: AudioClip = null!;

  @property(AudioClip)
  clipTheme: AudioClip = null!;

  private _musicEnabled = true;
  private _soundEnabled = true;

  private audioMap = new Map<AudioType, AudioClip>();

  public get musicEnabled(): boolean {
    return this._musicEnabled;
  }

  public get soundEnabled(): boolean {
    return this._soundEnabled;
  }

  onLoad() {
    if (AudioManager.instance === null) {
      AudioManager.instance = this;

      if (this.node.parent) {
        this.node.setParent(null);
      }

      director.addPersistRootNode(this.node);
    } else {
      this.node.destroy();
      return;
    }

    this.initAudioMap();
    this.loadSettings();
    this.registerEvents();
  }

  start() {
    this.playBGM();
  }

  onDestroy() {
    this.unregisterEvents();
  }

  private initAudioMap() {
    this.audioMap.set(AudioType.CLICK, this.clipClick);
    this.audioMap.set(AudioType.FLY, this.clipFly);
    this.audioMap.set(AudioType.POINT, this.clipPoint);
    this.audioMap.set(AudioType.HIT, this.clipHit);
    this.audioMap.set(AudioType.DIE, this.clipDie);
  }

  private loadSettings() {
    this._musicEnabled = this.isMusicEnabled();
    this._soundEnabled = this.isSoundEnabled();

    const bgmVolume = sys.localStorage.getItem("flappy_bgm_volume");
    const sfxVolume = sys.localStorage.getItem("flappy_sfx_volume");

    if (this.bgmSource) {
      this.bgmSource.volume = bgmVolume !== null ? parseFloat(bgmVolume) : 1;
    }

    if (this.sfxSource) {
      this.sfxSource.volume = sfxVolume !== null ? parseFloat(sfxVolume) : 1;
    }
  }

  private registerEvents() {
    EventManager.instance.on(AudioEvent.PLAY_SOUND, this.play, this);

    EventManager.instance.on(AudioEvent.TOGGLE_MUSIC, this.toggleMusic, this);

    EventManager.instance.on(AudioEvent.TOGGLE_SOUND, this.toggleSound, this);

    EventManager.instance.on(
      AudioEvent.SET_BGM_VOLUME,
      this.setBGMVolume,
      this,
    );

    EventManager.instance.on(
      AudioEvent.SET_SFX_VOLUME,
      this.setSFXVolume,
      this,
    );
  }

  private unregisterEvents() {
    EventManager.instance.off(AudioEvent.PLAY_SOUND, this.play, this);

    EventManager.instance.off(AudioEvent.TOGGLE_MUSIC, this.toggleMusic, this);

    EventManager.instance.off(AudioEvent.TOGGLE_SOUND, this.toggleSound, this);

    EventManager.instance.off(
      AudioEvent.SET_BGM_VOLUME,
      this.setBGMVolume,
      this,
    );

    EventManager.instance.off(
      AudioEvent.SET_SFX_VOLUME,
      this.setSFXVolume,
      this,
    );
  }

  // =====================
  // Storage Helpers
  // =====================

  private isMusicEnabled(): boolean {
    return sys.localStorage.getItem("flappy_music_enabled") !== "false";
  }

  private isSoundEnabled(): boolean {
    return sys.localStorage.getItem("flappy_sound_enabled") !== "false";
  }

  // =====================
  // Getter
  // =====================

  public getBGMVolume(): number {
    return this.bgmSource?.volume ?? 1;
  }

  public getSFXVolume(): number {
    return this.sfxSource?.volume ?? 1;
  }

  // =====================
  // Music
  // =====================

  public toggleMusic(): boolean {
    this._musicEnabled = !this.isMusicEnabled();

    sys.localStorage.setItem(
      "flappy_music_enabled",
      String(this._musicEnabled),
    );

    if (this._musicEnabled) {
      this.playBGM();
    } else {
      this.stopBGM();
    }

    return this._musicEnabled;
  }

  public playBGM() {
    if (!this.isMusicEnabled()) {
      return;
    }

    if (!this.bgmSource || !this.clipTheme) {
      return;
    }

    if (this.bgmSource.playing && this.bgmSource.clip === this.clipTheme) {
      return;
    }

    this.bgmSource.clip = this.clipTheme;
    this.bgmSource.loop = true;
    this.bgmSource.play();
  }

  public stopBGM() {
    this.bgmSource?.stop();
  }

  public setBGMVolume(volume: number) {
    if (!this.bgmSource) return;

    this.bgmSource.volume = volume;

    sys.localStorage.setItem("flappy_bgm_volume", volume.toString());
  }

  // =====================
  // SFX
  // =====================

  public toggleSound(): boolean {
    this._soundEnabled = !this.isSoundEnabled();

    sys.localStorage.setItem(
      "flappy_sound_enabled",
      String(this._soundEnabled),
    );

    return this._soundEnabled;
  }

  public setSFXVolume(volume: number) {
    if (!this.sfxSource) return;

    this.sfxSource.volume = volume;

    sys.localStorage.setItem("flappy_sfx_volume", volume.toString());
  }

  public play(type: AudioType) {
    if (!this.isSoundEnabled()) {
      return;
    }

    const clip = this.audioMap.get(type);

    if (!clip) {
      console.warn(`[AudioManager] Missing clip: ${type}`);
      return;
    }

    this.playSFX(clip);
  }

  private playSFX(clip: AudioClip) {
    if (!this.isSoundEnabled()) {
      return;
    }

    if (!this.sfxSource || !clip) {
      return;
    }

    this.sfxSource.playOneShot(clip, this.sfxSource.volume);
  }
}
