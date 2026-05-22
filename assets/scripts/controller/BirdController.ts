import { _decorator, Component, EventTouch, input, Input, Node, RigidBody2D, Vec2, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { EventManager } from '../manager/EventManager';
const { ccclass, property } = _decorator;

@ccclass('BirdController')
export class BirdController extends Component {


    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onScreenTap, this);
        input.on(Input.EventType.KEY_DOWN, this.onSpaceBarPress, this);

        let collider = this.node.getComponent(Collider2D);
        if (collider) {

            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
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

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherName = otherCollider.node.name;
        console.log("in begin")

        if (otherName !== 'point_area') {
            this.handleGameOver(otherName);
        }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherName = otherCollider.node.name;
        console.log("in end")

        if (otherName === 'point_area') {
            this.handleAddScore();
        }
    }

    private handleAddScore() {

        EventManager.instance.emit("add-point")

    }

    private handleGameOver(obstacleName: string) {
        
        EventManager.instance.emit("end-game")

    }

    onScreenTap(event: EventTouch) {
        
        this.makeBirdJump();
    }

    onSpaceBarPress(event: any) {
        if (event.keyCode === 32) {
            this.makeBirdJump();
        }
    }

    makeBirdJump() {
        if (this.node.getComponent(RigidBody2D)) {
            this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 10);
        }
    }
}