import { _decorator, Component, Node } from "cc";
import { EventManager } from "../manager/EventManager";
const { ccclass, property } = _decorator;

@ccclass("PausePanelController")
export class PausePanelController extends Component {
  onResumeButtonClick() {
    EventManager.instance.emit("resume-game");
    this.node.active = false;
  }
}
