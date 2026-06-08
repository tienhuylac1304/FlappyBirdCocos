import { _decorator, Component, Node, EventTarget } from "cc";
import { GameState } from "./GameState";
import { EventManager } from "./EventManager";
const { ccclass } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static _instance: GameManager;

  public static get Instance() {
    if (!this._instance) {
      this._instance = new GameManager();
    }
    return this._instance;
  }

  private _state = GameState.READY;

  public get state() {
    return this._state;
  }

  public changeState(newState: GameState) {
    if (this._state === newState) return;

    this._state = newState;

    EventManager.instance.emit("STATE_CHANGED", newState);
  }
}
