import { _decorator, Component, Node } from "cc";
import { EventManager } from "./EventManager";
import { AudioEvent, AudioType } from "./AudioEnum";
const { ccclass, property } = _decorator;

@ccclass("MenuManager")
export class MenuManager extends Component {
  onLoad() {}
  onPlayButtonClick() {
    EventManager.instance.emit("go-to-gameplay");
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
  }
  onSettingsButtonClick() {
    EventManager.instance.emit("go-to-settings");
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
  }
  onShopButtonClick() {
    EventManager.instance.emit("go-to-shop");
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
  }
  onLeaderboardButtonClick() {
    EventManager.instance.emit("go-to-leaderboard");
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
  }
  onRuleButtonClick() {
    EventManager.instance.emit("go-to-rule");
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
  }
  onInfoButtonClick() {
    EventManager.instance.emit("go-to-info");
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
  }
}
