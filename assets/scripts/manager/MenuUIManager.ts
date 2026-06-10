import { _decorator, Component, director, Node } from "cc";
import { EventManager } from "./EventManager";
const { ccclass, property } = _decorator;

@ccclass("MenuUIManager")
export class MenuUIManager extends Component {
  //*** UI Menu ***//
  @property({ type: Node, tooltip: "Panel menu" })
  setting_panel: Node = null;

  onLoad() {
    EventManager.instance.on("go-to-gameplay", this.handleGoToGameplay, this);
    EventManager.instance.on("go-to-settings", this.handleGoToSettings, this);
    EventManager.instance.on("go-to-shop", this.handleGoToShop, this);
    EventManager.instance.on(
      "go-to-leaderboard",
      this.handleGoToLeaderboard,
      this,
    );
    EventManager.instance.on("go-to-rule", this.handleGoToRule, this);
    EventManager.instance.on("go-to-info", this.handleGoToInfo, this);
    EventManager.instance.on("close-panels", this.handleClosePanels, this);
  }

  onDestroy() {
    EventManager.instance.off("go-to-gameplay", this.handleGoToGameplay, this);
    EventManager.instance.off("go-to-settings", this.handleGoToSettings, this);
    EventManager.instance.off("go-to-shop", this.handleGoToShop, this);
    EventManager.instance.off(
      "go-to-leaderboard",
      this.handleGoToLeaderboard,
      this,
    );
    EventManager.instance.off("go-to-rule", this.handleGoToRule, this);
    EventManager.instance.off("go-to-info", this.handleGoToInfo, this);
    EventManager.instance.off("close-panels", this.handleClosePanels, this);
  }

  uiState(setting: boolean) {
    this.setting_panel.active = setting;
  }
  handleGoToGameplay() {
    director.loadScene("game_play");
  }
  handleGoToSettings() {
    this.uiState(true);
  }
  handleGoToShop() {}
  handleGoToLeaderboard() {}
  handleGoToRule() {}
  handleGoToInfo() {}
  handleClosePanels() {
    this.uiState(false);
  }
}
