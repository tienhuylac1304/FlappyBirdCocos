import { _decorator, Component, Slider, Node, Sprite, SpriteFrame } from "cc";
import { AudioEvent, AudioType } from "../manager/AudioEnum";
import { EventManager } from "../manager/EventManager";
import { AudioManager } from "../manager/AudioManager";

const { ccclass, property } = _decorator;

@ccclass("SettingPanelController")
export class SettingPanelController extends Component {
  @property({ type: Slider, tooltip: "Music volume slider" })
  music_slider: Slider = null!;

  @property({ type: Slider, tooltip: "Sound volume slider" })
  sound_slider: Slider = null!;

  @property({ type: SpriteFrame, tooltip: "Sound on sprite frame" })
  sound_on_frame: SpriteFrame = null!;

  @property({ type: SpriteFrame, tooltip: "Sound off sprite frame" })
  sound_off_frame: SpriteFrame = null!;

  @property({ type: SpriteFrame, tooltip: "Music on sprite frame" })
  music_on_frame: SpriteFrame = null!;

  @property({ type: SpriteFrame, tooltip: "Music off sprite frame" })
  music_off_frame: SpriteFrame = null!;

  @property({ type: Sprite, tooltip: "Sound button" })
  sound_btn: Sprite = null!;

  @property({ type: Sprite, tooltip: "Music button" })
  music_btn: Sprite = null!;

  _previewTimer: number = 0;

  onEnable() {
    this.setSliderState();
    this.updateUI(this.music_slider.progress, this.sound_slider.progress);
  }

  private setSliderState() {
    const audioManager = AudioManager.instance;

    if (!audioManager) return;

    this.music_slider.progress = audioManager.getBGMVolume();
    this.sound_slider.progress = audioManager.getSFXVolume();
  }

  public onMusicSliderChanged(slider: Slider) {
    EventManager.instance.emit(AudioEvent.SET_BGM_VOLUME, slider.progress);
    this.updateUI(slider.progress, this.sound_slider.progress);
  }

  public onSoundSliderChanged(slider: Slider) {
    EventManager.instance.emit(AudioEvent.SET_SFX_VOLUME, slider.progress);
    this.updateUI(this.music_slider.progress, slider.progress);
    const now = Date.now();

    if (now - this._previewTimer > 500) {
      this._previewTimer = now;

      EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    }
  }

  public onCloseButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);

    EventManager.instance.emit("close-panels");
  }
  updateUI(music_volume: number, sfx_volume: number) {
    if (music_volume === 0 || !AudioManager.instance.musicEnabled) {
      this.music_btn.spriteFrame = this.music_off_frame;
    } else {
      this.music_btn.spriteFrame = this.music_on_frame;
    }
    if (sfx_volume === 0 || !AudioManager.instance.soundEnabled) {
      this.sound_btn.spriteFrame = this.sound_off_frame;
    } else {
      this.sound_btn.spriteFrame = this.sound_on_frame;
    }
  }
  onSoundButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    EventManager.instance.emit(AudioEvent.TOGGLE_SOUND);
    this.updateUI(this.music_slider.progress, this.sound_slider.progress);
  }
  onMusicButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    EventManager.instance.emit(AudioEvent.TOGGLE_MUSIC);
    this.updateUI(this.music_slider.progress, this.sound_slider.progress);
  }
}
