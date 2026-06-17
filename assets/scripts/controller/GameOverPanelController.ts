import { _decorator, Component, Node, Label } from "cc";
import { EventManager } from "../manager/EventManager";
import { AudioEvent, AudioType } from "../manager/AudioEnum";
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

  protected onDestroy(): void {
    EventManager.instance.off(
      "update-end-game-score",
      this.handleUpdateScore,
      this,
    );
  }

  handleUpdateScore(score: number, best_score: number) {
    this.txt_score.string = score.toString();
    this.txt_best_score.string = best_score.toString();
  }
  onRestartButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    EventManager.instance.emit("restart-game");
  }
  onMenuButtonClick() {
    EventManager.instance.emit(AudioEvent.PLAY_SOUND, AudioType.CLICK);
    EventManager.instance.emit("go-to-menu");
  }
}
