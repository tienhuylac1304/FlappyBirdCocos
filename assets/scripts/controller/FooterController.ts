import { _decorator, Component, Label, Node } from "cc";
import { EventManager } from "../manager/EventManager";
const { ccclass, property } = _decorator;

@ccclass("FooterController")
export class FooterController extends Component {
  @property(Label)
  txt_point: Label = null;

  onLoad() {
    EventManager.instance.on("point-change", this.onPointChange, this);
  }
  protected onDestroy(): void {
    EventManager.instance.off("point-change", this.onPointChange, this);
  }
  onPointChange(point: number) {
    this.txt_point.string = point.toString();
  }
}
