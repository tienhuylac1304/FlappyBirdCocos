import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PipeController")
export class PipeController extends Component {
  init(parent: Node, position_x: number) {
    this.node.setParent(parent);

    let pointArea = this.node.getChildByName("point_area");
    if (pointArea) {
      pointArea["hasScored"] = false;
    }

    this.onResetPosition(position_x);
  }

  onResetPosition(position_x: number) {
    let pos_y = Math.floor(Math.random() * 301) - 150;

    this.node.setPosition(new Vec3(position_x, pos_y, 0));

    let pointArea = this.node.getChildByName("point_area");
    if (pointArea) {
      pointArea["hasScored"] = false;
    }
  }
}
