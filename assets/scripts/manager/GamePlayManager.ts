import { _decorator, Component, Node, sys } from "cc";
import { EventManager } from "./EventManager";
import { GameState } from "./GameState";
import { GameManager } from "./GameManager";
const { ccclass } = _decorator;

@ccclass("GamePlayManager")
export class GamePlayManager extends Component {
  //Local variable
  private score: number = 0;
  best_score: number = 0;

  onLoad() {
    const saved_best_score = sys.localStorage.getItem("best_score");
    if (saved_best_score) {
      this.best_score = parseInt(saved_best_score);
    }

    EventManager.instance.on("start-game", this.handleStartGame, this);
    EventManager.instance.on("game-over", this.handleGameOver, this);
    EventManager.instance.on("add-point", this.handleAddPoint, this);
    EventManager.instance.on("pause-game", this.handlePauseGame, this);
    EventManager.instance.on("STATE_CHANGED", this.handleStateChanged, this);
    EventManager.instance.on("restart-game", this.handleRestartGame, this);
    EventManager.instance.on("continue-game", this.handleResumeGame, this);
  }

  onDestroy() {
    // Gỡ tất cả sự kiện khi Scene Gameplay bị hủy
    EventManager.instance.off("start-game", this.handleStartGame, this);
    EventManager.instance.off("game-over", this.handleGameOver, this);
    EventManager.instance.off("add-point", this.handleAddPoint, this);
    EventManager.instance.off("pause-game", this.handlePauseGame, this);
    EventManager.instance.off("STATE_CHANGED", this.handleStateChanged, this);
    EventManager.instance.off("restart-game", this.handleRestartGame, this);
    EventManager.instance.off("continue-game", this.handleResumeGame, this);
  }

  start() {
    GameManager.Instance.changeState(GameState.READY);
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
    if (this.score > this.best_score) {
      this.best_score = this.score; // Cập nhật kỷ lục mới
      sys.localStorage.setItem("best_score", this.best_score.toString()); // Lưu vào bộ nhớ máy
    }
    EventManager.instance.emit("end-game", this.score, this.best_score);
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
