import { _decorator, Component, Node, Label, sys, Button } from "cc";
import { EventManager } from "./EventManager";
import { GameState } from "./GameState";
const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIController extends Component {
  //Ready UI
  @property({ type: Label, tooltip: "Label score in gameplay" })
  txt_score: Label = null;
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

  onLoad() {
    this.panel_ready.active = true;
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
  }
  handleResumeGame() {
    console.log("resume game run");
    this.uiState(false, true, false, false, true, false);
  }
  handleReadyGame() {
    this.uiState(true, false, false, false, false, true);
  }
  handlePlayingGame() {
    this.uiState(false, true, false, false, false, true);
  }

  handleEndGame(score: number) {
    this.uiState(false, false, false, true, false, false);
    EventManager.instance.emit("update-end-game-score", score);
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
}
