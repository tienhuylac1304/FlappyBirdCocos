import { _decorator, Component, Node, Label, sys, Button, director } from "cc";
import { EventManager } from "./EventManager";
import { GameState } from "./GameState";
const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIController extends Component {
  //Ready UI
  @property({ type: Label, tooltip: "Label score in gameplay" })
  txt_score: Label = null;
  @property({ type: Label, tooltip: "Label best score in gameplay" })
  txt_best_score: Label = null;
  @property({ type: Node, tooltip: "Ready panel" })
  panel_ready: Node = null;
  //Game Over UI
  @property({ type: Node, tooltip: "Panel end game" })
  panel_end_game: Node = null;
  @property({ type: Node, tooltip: "Header node" })
  header_node: Node = null;
  //Pause game UI
  @property({ type: Node, tooltip: "Panel pause game" })
  panel_pause_game: Node = null;
  @property({ type: Button, tooltip: "Button pause game" })
  btn_pause: Button = null;
  //Resume UI
  @property({ type: Node, tooltip: "Panel resume game" })
  panel_resume: Node = null;

  //local variable
  best_score: number = 0;
  onLoad() {
    this.uiState(true, false, false, false, false, true);
    EventManager.instance.on(
      "update-gameplay-score",
      this.onUpdateGameplayScore,
      this,
    );
    EventManager.instance.on("end-game", this.handleEndGame, this);
    EventManager.instance.on("game-state-paused", this.handlePauseGame, this);
    EventManager.instance.on(
      "game-state-playing",
      this.handlePlayingGame,
      this,
    );
    EventManager.instance.on("game-state-ready", this.handleReadyGame, this);
    EventManager.instance.on("resume-game", this.handleResumeGame, this);

    EventManager.instance.on("go-to-menu", this.handleGoToMenu, this);
  }

  onDestroy() {
    // Gỡ tất cả sự kiện khi Node UI bị hủy (Chuyển scene)
    EventManager.instance.off(
      "update-gameplay-score",
      this.onUpdateGameplayScore,
      this,
    );
    EventManager.instance.off("end-game", this.handleEndGame, this);
    EventManager.instance.off("game-state-paused", this.handlePauseGame, this);
    EventManager.instance.off(
      "game-state-playing",
      this.handlePlayingGame,
      this,
    );
    EventManager.instance.off("game-state-ready", this.handleReadyGame, this);
    EventManager.instance.off("resume-game", this.handleResumeGame, this);
    EventManager.instance.off("go-to-menu", this.handleGoToMenu, this);
  }

  handleResumeGame() {
    console.log("resume game run");
    this.uiState(false, true, false, false, true, false);
  }
  handleReadyGame() {
    this.uiState(true, false, false, false, false, true);
  }
  handlePlayingGame() {
    this.updateGameplayBestScore();
    this.uiState(false, true, false, false, false, true);
  }

  handleEndGame(score: number, best_score: number) {
    this.uiState(false, false, false, true, false, false);
    EventManager.instance.emit("update-end-game-score", score, best_score);
  }

  onUpdateGameplayScore(score: number) {
    this.txt_score.string = score.toString();
  }
  onPauseGame() {
    EventManager.instance.emit("pause-game");
  }
  handlePauseGame() {
    this.uiState(false, true, true, false, false, false);
  }
  uiState(
    ready: boolean,
    header: boolean,
    panel_pause_game: boolean,
    panel_end_game: boolean,
    panel_resume: boolean,
    btn_pause: boolean,
  ) {
    this.panel_ready.active = ready;
    this.header_node.active = header;
    this.panel_pause_game.active = panel_pause_game;
    this.panel_end_game.active = panel_end_game;
    this.panel_resume.active = panel_resume;
    this.btn_pause.interactable = btn_pause;
  }

  handleGoToMenu() {
    director.loadScene("game_menu");
  }
  getBestScore() {
    const saved_best_score = sys.localStorage.getItem("best_score");
    if (saved_best_score) {
      this.best_score = parseInt(saved_best_score);
    }
  }
  updateGameplayBestScore() {
    this.getBestScore();
    this.txt_best_score.string = this.best_score.toString();
  }
}
