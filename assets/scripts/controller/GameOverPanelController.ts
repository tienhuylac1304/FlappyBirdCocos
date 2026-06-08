import { _decorator, Component, Node, Label } from "cc";
import { EventManager } from "../manager/EventManager";
const { ccclass, property } = _decorator;

@ccclass("GameOverPanelController")
export class GameOverPanelController extends Component {
  @property({ type: Label, tooltip: "Game score" }) txt_score: Label = null;
  @property({ type: Label, tooltip: "Best score" }) txt_best_score: Label =
    null;

  protected onLoad(): void {
    EventManager.instance.on(
      "update-end-game-score",
      this.handleUpdateScore,
      this,
    );
  }

  handleUpdateScore(score: number) {
    this.txt_score.string = score.toString();
  }
  onRestartButtonClick() {
    EventManager.instance.emit("restart-game");
  }
}
