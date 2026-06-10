import { _decorator, Component, Node } from "cc";
import { EventManager } from "./EventManager";
const { ccclass, property } = _decorator;

@ccclass("MenuManager")
export class MenuManager extends Component {
  onLoad() {}
  onPlayButtonClick() {
    EventManager.instance.emit("go-to-gameplay");
  }
  onSettingsButtonClick() {
    EventManager.instance.emit("go-to-settings");
  }
  onShopButtonClick() {
    EventManager.instance.emit("go-to-shop");
  }
  onLeaderboardButtonClick() {
    EventManager.instance.emit("go-to-leaderboard");
  }
  onRuleButtonClick() {
    EventManager.instance.emit("go-to-rule");
  }
  onInfoButtonClick() {
    EventManager.instance.emit("go-to-info");
  }
  onCloseButtonClick() {
    EventManager.instance.emit("close-panels");
  }
}
