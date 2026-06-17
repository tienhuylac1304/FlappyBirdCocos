import { _decorator, Component, Node, Sprite, SpriteFrame } from "cc";
import { EventManager } from "../manager/EventManager";
import { AudioEvent, AudioType } from "../manager/AudioEnum";
import { AudioManager } from "../manager/AudioManager";
const { ccclass, property } = _decorator;

@ccclass("PausePanelController")
export class PausePanelController extends Component {
  @property({ type: SpriteFrame, tooltip: "Sound on sprite frame" })
  sound_on_frame: SpriteFrame;

  @property({ type: SpriteFrame, tooltip: "Sound off sprite frame" })
  sound_off_frame: SpriteFrame;

  @property({ type: SpriteFrame, tooltip: "Music on sprite frame" })
  music_on_frame: SpriteFrame;

  @property({ type: SpriteFrame, tooltip: "Music off sprite frame" })
  music_off_frame: SpriteFrame;

  @property({ type: Node, tooltip: "Sound button" })
  sound_btn: Node;

  @property({ type: Node, tooltip: "Music button" })
  music_btn: Node;

  //local variable
  private is_music_on: boolean = true;
  private is_sound_on: boolean = true;
  onEnable() {
    this.getAudioState();
    this.update_ui();
  }
  update_ui() {
    if (this.is_music_on) {
      this.music_btn.getComponent(Sprite).spriteFrame = this.music_on_frame;
    } else {
      this.music_btn.getComponent(Sprite).spriteFrame = this.music_off_frame;
    }

    if (this.is_sound_on) {
      this.sound_btn.getComponent(Sprite).spriteFrame = this.sound_on_frame;
    } else {
      this.sound_btn.getComponent(Sprite).spriteFrame = this.sound_off_frame;
    }
  }
  onSoundButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    EventManager.instance.emit(AudioEvent.TOGGLE_SOUND);
    this.getAudioState();
    this.update_ui();
  }
  onMusicButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    EventManager.instance.emit(AudioEvent.TOGGLE_MUSIC);
    this.getAudioState();
    this.update_ui();
  }
  onResumeButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    EventManager.instance.emit("resume-game");
    this.node.active = false;
  }
  onMenuButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    EventManager.instance.emit("go-to-menu");
  }
  getAudioState() {
    this.is_music_on = AudioManager.instance.musicEnabled;
    this.is_sound_on = AudioManager.instance.soundEnabled;
  }
}
