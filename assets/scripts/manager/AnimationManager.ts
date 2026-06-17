import { _decorator, Animation, AnimationState, Component, Node } from "cc";
import { EventManager } from "./EventManager";
const { ccclass, property } = _decorator;

@ccclass("AnimationManager")
export class AnimationManager extends Component {
  @property({ type: Animation, tooltip: "Bird animation" })
  bird_anim: Animation;
  onLoad() {
    EventManager.instance.on("bird-flying", this.handleBirdFly, this);
    EventManager.instance.on("bird-die", this.handleBirdDie, this);
  }
  onDestroy() {
    EventManager.instance.off("bird-flying", this.handleBirdFly, this);
    EventManager.instance.off("bird-die", this.handleBirdDie, this);
  }
  handleBirdFly() {
    this.bird_anim.play("bird_flying");
  }
  handleBirdDie() {
    this.bird_anim.stop();
    this.bird_anim.play("bird_die");
    this.bird_anim.once(
      Animation.EventType.FINISHED,
      this.onBirdDieFinished,
      this,
    );
  }
  onBirdDieFinished(type: Animation.EventType, state: AnimationState) {
    if (state.name === "bird_die") {
      EventManager.instance.emit("bird-die-finished");
    }
  }
}
