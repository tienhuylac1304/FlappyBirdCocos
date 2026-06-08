import { _decorator, Component, Node } from "cc";
import { EventManager } from "./EventManager";
import { GameState } from "./GameState";
import { GameManager } from "./GameManager";
const { ccclass } = _decorator;

@ccclass("GamePlayManager")
export class GamePlayManager extends Component {
  //Local variable
  private score: number = 0;

  onLoad() {
    EventManager.instance.on("start-game", this.handleStartGame, this);
    EventManager.instance.on("game-over", this.handleGameOver, this);
    EventManager.instance.on("add-point", this.handleAddPoint, this);
    EventManager.instance.on("pause-game", this.handlePauseGame, this);
    EventManager.instance.on("STATE_CHANGED", this.handleStateChanged, this);
    EventManager.instance.on("restart-game", this.handleRestartGame, this);
    EventManager.instance.on("continue-game", this.handleResumeGame, this);
  }
  handleResumeGame() {
    GameManager.Instance.changeState(GameState.PLAYING);
  }
  handleRestartGame() {
    GameManager.Instance.changeState(GameState.READY);
  }
  handleAddPoint() {
    this.score += 1;
    EventManager.instance.emit("update-gameplay-score", this.score);
  }
  handleGameOver() {
    GameManager.Instance.changeState(GameState.GAMEOVER);
    EventManager.instance.emit("end-game", this.score);
  }
  handleStateChanged(state: GameState) {
    switch (state) {
      case GameState.READY:
        this.score = 0;
        EventManager.instance.emit("update-gameplay-score", this.score);
        EventManager.instance.emit("game-state-ready");
        break;
      case GameState.GAMEOVER:
        EventManager.instance.emit("game-state-gameover");
        break;
      case GameState.PLAYING:
        EventManager.instance.emit("game-state-playing");
        break;
      case GameState.PAUSED:
        EventManager.instance.emit("game-state-paused");
        break;
      default:
        this.score = 0;
        EventManager.instance.emit("update-gameplay-score", this.score);
        EventManager.instance.emit("game-state-ready");
        break;
    }
  }
  handleStartGame() {
    GameManager.Instance.changeState(GameState.PLAYING);
  }
  handlePauseGame() {
    GameManager.Instance.changeState(GameState.PAUSED);
  }
}
