import {
  _decorator,
  Component,
  EventTouch,
  input,
  Input,
  Node,
  RigidBody2D,
  Vec2,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Vec3,
  ERigidBody2DType,
  Tween,
  tween,
  view,
  PhysicsSystem2D, // Đã thêm hệ thống vật lý
} from "cc";
import { EventManager } from "../manager/EventManager";
import { GameState } from "../manager/GameState";
import { AudioManager } from "../manager/AudioManager";
import { GameManager } from "../manager/GameManager";
const { ccclass, property } = _decorator;

@ccclass("BirdController")
export class BirdController extends Component {
  @property({ tooltip: "Vận tốc nhảy của chim" })
  jumpVelocity: number = 10;

  @property({ tooltip: "Tỉ lệ trọng lực khi chơi" })
  gravityScale: number = 1;

  @property({ tooltip: "Tỉ lệ trọng lực khi game over" })
  gameOverGravityScale: number = 1;

  // Local variable
  private is_dead: boolean = false;
  private init_pos: Vec3 = Vec3.ZERO;
  private game_state: GameState;
  private birdTween: Tween<Node> = null;

  rb: RigidBody2D;

  onLoad() {
    this.game_state = GameManager.Instance.state;
    this.is_dead = false;
    this.init_pos = this.node.position.clone();
    this.rb = this.node.getComponent(RigidBody2D);
    this.rigiBodyState();
    this.isKinematic(this.game_state === GameState.READY);

    if (this.game_state === GameState.READY) {
      this.startFloatingEffect();
    }

    // Init input events
    input.on(Input.EventType.TOUCH_START, this.onScreenTap, this);
    input.on(Input.EventType.KEY_DOWN, this.onSpaceBarPress, this);

    // Init event for physics
    let collider = this.node.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    // Init game events
    EventManager.instance.on(
      "game-state-ready",
      this.handleGameStateReady,
      this,
    );
    EventManager.instance.on(
      "game-state-playing",
      this.handleGameStatePlaying,
      this,
    );
    EventManager.instance.on(
      "game-state-gameover",
      this.handleGameStateGameOver,
      this,
    );
    EventManager.instance.on(
      "game-state-paused",
      this.handleGameStatePaused,
      this,
    );
    EventManager.instance.on("STATE_CHANGED", this.getGameState, this);
  }

  update(deltaTime: number) {
    if (this.game_state === GameState.PLAYING && !this.is_dead) {
      this.checkScreenBoundaries();
    }
  }

  onDestroy() {
    input.off(Input.EventType.TOUCH_START, this.onScreenTap, this);
    input.off(Input.EventType.KEY_DOWN, this.onSpaceBarPress, this);

    let collider = this.node.getComponent(Collider2D);
    if (collider) {
      collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null,
  ) {
    let otherName = otherCollider.node.name;

    if (otherName !== "point_area") {
      this.handleGameOver();
    }
  }

  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null,
  ) {
    let otherName = otherCollider.node.name;

    if (otherName === "point_area" && !this.is_dead) {
      let pointAreaNode = otherCollider.node;
      if (!pointAreaNode["hasScored"]) {
        pointAreaNode["hasScored"] = true;
        this.handleAddScore();
      }
    }
  }

  private handleAddScore() {
    EventManager.instance.emit("add-point");
    // if (AudioManager.instance) {
    //   AudioManager.instance.playPoint();
    // }
  }

  handleGameOver() {
    this.is_dead = true;
    this.rigiBodyState();
    EventManager.instance.emit("game-over");
  }

  onScreenTap(event: EventTouch) {
    if (this.game_state === GameState.READY) this.startGame();
    this.handleJumpTrigger();
  }

  onSpaceBarPress(event: any) {
    if (event.keyCode === 32) {
      if (this.game_state === GameState.READY) this.startGame();
      this.handleJumpTrigger();
    }
  }

  private handleJumpTrigger() {
    this.makeBirdJump();
  }

  makeBirdJump() {
    const rigidBody = this.rb;
    if (rigidBody) {
      rigidBody.linearVelocity = new Vec2(0, this.jumpVelocity);
      // if (AudioManager.instance) {
      //   AudioManager.instance.playFly();
      // }
    }
  }

  rigiBodyState() {
    this.rb.enabled = !this.is_dead;
  }

  handleGameStateReady() {
    this.is_dead = false;

    // Đảm bảo bật lại hệ thống vật lý khi restart
    PhysicsSystem2D.instance.enable = true;

    this.rigiBodyState();
    this.isKinematic(true);
    this.node.setPosition(this.init_pos);

    // Khôi phục trạng thái cân bằng
    this.node.angle = 0;
    if (this.rb) {
      this.rb.linearVelocity = Vec2.ZERO;
      this.rb.angularVelocity = 0;
    }

    this.startFloatingEffect();
  }

  handleGameStatePlaying() {
    this.is_dead = false;
    this.stopFloatingEffect();
    this.isKinematic(false);

    // Đánh thức hệ thống vật lý nếu trước đó bị Pause
    PhysicsSystem2D.instance.enable = true;
  }

  handleGameStateGameOver() {
    this.is_dead = true;
    this.isKinematic(false);
  }

  handleGameStatePaused() {
    this.is_dead = false;

    // Đóng băng toàn bộ hệ thống vật lý (trọng lực, va chạm, vận tốc dừng ngay lập tức)
    PhysicsSystem2D.instance.enable = false;
  }

  isKinematic(isKinematic: boolean) {
    setTimeout(() => {
      this.rb.type = isKinematic
        ? ERigidBody2DType.Kinematic
        : ERigidBody2DType.Dynamic;
    }, 0);
  }

  startGame() {
    EventManager.instance.emit("start-game");
  }

  // --- HIỆU ỨNG TRẠNG THÁI READY ---
  startFloatingEffect() {
    this.stopFloatingEffect();

    this.node.setPosition(this.init_pos);

    const jumpHeight = 45;
    const timeUp = 0.4;
    const timeDown = 0.4;

    this.birdTween = tween(this.node)
      .sequence(
        tween().to(
          timeUp,
          {
            position: new Vec3(
              this.init_pos.x,
              this.init_pos.y + jumpHeight,
              0,
            ),
          },
          { easing: "quadOut" },
        ),
        tween().to(timeDown, { position: this.init_pos }, { easing: "quadIn" }),
      )
      .repeatForever()
      .start();
  }

  stopFloatingEffect() {
    if (this.birdTween) {
      this.birdTween.stop();
      this.birdTween = null;
    }
  }

  private checkScreenBoundaries() {
    const screenHeight = view.getVisibleSize().height;
    const topBoundary = screenHeight / 2 + 70;
    const bottomBoundary = -screenHeight / 2 - 70;
    const currentY = this.node.position.y;

    if (currentY > topBoundary || currentY < bottomBoundary) {
      this.handleGameOver();
    }
  }

  getGameState() {
    this.game_state = GameManager.Instance.state;
  }
}
