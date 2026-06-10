import {
  _decorator,
  Component,
  director,
  instantiate,
  Node,
  Prefab,
  UITransform,
  view,
} from "cc";
import { PipeController } from "./PipeController";
import { EventManager } from "../manager/EventManager";
import { GameState } from "../manager/GameState";
import { GameManager } from "../manager/GameManager";
const { ccclass, property } = _decorator;

@ccclass("BacgroundController")
export class BacgroundController extends Component {
  @property(Node) bg1: Node = null;
  @property(Node) bg2: Node = null;
  @property speed: number = 180;
  @property(Prefab) pipePrefab: Prefab = null;

  is_playing: boolean = false;
  is_pause: boolean = false;
  is_end_game: boolean = false;

  @property pipeSpacing: number = 450;

  pipe_list: PipeController[] = [];
  private bgWidth: number = 0;

  game_state: GameState;
  scene_name: String;

  is_bird_die: boolean = false;

  onLoad() {
    //init game events
    EventManager.instance.on("STATE_CHANGED", this.getGameState, this);
    EventManager.instance.on("bird-die", this.isBirdDie, this);
  }
  onDestroy() {
    EventManager.instance.off("STATE_CHANGED", this.getGameState, this);
    EventManager.instance.off("bird-die", this.isBirdDie, this);
  }

  start() {
    this.scene_name = director.getScene().name;
    this.game_state = GameManager.Instance.state;
    const uiTransform1 = this.bg1.getComponent(UITransform);
    this.bgWidth = uiTransform1.width;

    this.bg1.setPosition(0, this.bg1.position.y);
    this.bg2.setPosition(this.bgWidth, this.bg2.position.y);
    this.onInitPipe();
  }

  update(deltaTime: number) {
    // Normal moving speed
    const moveAmount = this.speed * deltaTime;
    if (this.scene_name === "game_play") {
      if (this.is_bird_die) return;
      if (
        this.game_state === GameState.PLAYING ||
        this.game_state === GameState.READY
      ) {
        this.onBackgroundMove(moveAmount);
      }
      if (this.game_state === GameState.PLAYING) {
        this.onPipeMove(moveAmount);
      }
    } else {
      this.onBackgroundMove(moveAmount);
    }
  }

  checkAndResetBg(currentBg: Node, otherBg: Node) {
    if (currentBg.position.x <= -this.bgWidth) {
      const overshoot = currentBg.position.x + this.bgWidth;
      const newX = otherBg.position.x + this.bgWidth + overshoot;
      currentBg.setPosition(newX, currentBg.position.y);
    }
  }

  onInitPipe() {
    const rightEdge = view.getVisibleSize().width / 2;

    let start_pos_x = rightEdge + 100;

    for (let i = 0; i < 6; i++) {
      let pipe = instantiate(this.pipePrefab);
      let pipeCtrl = pipe.getComponent(PipeController);

      let current_pos_x = start_pos_x + i * this.pipeSpacing;

      pipeCtrl.init(this.node, current_pos_x);
      this.pipe_list.push(pipeCtrl);
    }
  }

  resetPipes() {
    const rightEdge = view.getVisibleSize().width / 2;

    let start_pos_x = rightEdge + 100;
    this.pipe_list.forEach((pipe, i) => {
      let current_pos_x = start_pos_x + i * this.pipeSpacing;
      pipe.onResetPosition(current_pos_x);
    });
  }

  onPipeMove(move_amount: number) {
    const leftBoundary = -view.getVisibleSize().width / 2 - 200;

    this.pipe_list.forEach((pipe) => {
      pipe.node.setPosition(
        pipe.node.position.x - move_amount,
        pipe.node.position.y,
        0,
      );

      if (pipe.node.position.x <= leftBoundary) {
        let maxX = leftBoundary;
        this.pipe_list.forEach((p) => {
          if (p.node.position.x > maxX) {
            maxX = p.node.position.x;
          }
        });

        pipe.onResetPosition(maxX + this.pipeSpacing);
      }
    });
  }

  onBackgroundMove(move_amount: number) {
    this.bg1.setPosition(
      this.bg1.position.x - move_amount,
      this.bg1.position.y,
    );
    this.bg2.setPosition(
      this.bg2.position.x - move_amount,
      this.bg2.position.y,
    );

    this.checkAndResetBg(this.bg1, this.bg2);
    this.checkAndResetBg(this.bg2, this.bg1);
  }
  getGameState() {
    this.game_state = GameManager.Instance.state;
    if (this.game_state === GameState.READY) {
      this.is_bird_die = false;
      if (this.pipe_list.length > 0) {
        this.resetPipes();
      }
    }
  }
  isBirdDie() {
    this.is_bird_die = true;
  }
}
