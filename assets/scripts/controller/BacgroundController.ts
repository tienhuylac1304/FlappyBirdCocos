import { _decorator, Component, instantiate, Node, Prefab, UITransform, view } from 'cc';
import { PipeController } from './PipeController';
const { ccclass, property } = _decorator;

@ccclass('BacgroundController')
export class BacgroundController extends Component {
    @property(Node) bg1: Node = null;
    @property(Node) bg2: Node = null;
    @property speed: number = 180; 
    @property(Prefab) pipePrefab: Prefab = null; 
    
    @property pipeSpacing: number = 450; 

    pipe_list: PipeController[] = [];
    private bgWidth: number = 0;

    start() {
        const uiTransform1 = this.bg1.getComponent(UITransform);
        this.bgWidth = uiTransform1.width;
        
        this.bg1.setPosition(0, this.bg1.position.y);
        this.bg2.setPosition(this.bgWidth, this.bg2.position.y);
        
        this.onInitPipe();
    }

    update(deltaTime: number) {
        const moveAmount = this.speed * deltaTime;

        this.bg1.setPosition(this.bg1.position.x - moveAmount, this.bg1.position.y);
        this.bg2.setPosition(this.bg2.position.x - moveAmount, this.bg2.position.y);

        this.checkAndResetBg(this.bg1, this.bg2);
        this.checkAndResetBg(this.bg2, this.bg1);

        this.onPipeMove(deltaTime);
    }

    checkAndResetBg(currentBg: Node, otherBg: Node) {
        if (currentBg.position.x <= -this.bgWidth) {
            const overshoot = currentBg.position.x + this.bgWidth;
            const newX = otherBg.position.x + this.bgWidth + overshoot;
            currentBg.setPosition(newX, currentBg.position.y);
        }
    }

    onInitPipe() {
        let start_pos_x = 300; 
        
        for (let i = 0; i < 6; i++) {
            let pipe = instantiate(this.pipePrefab);
            let pipeCtrl = pipe.getComponent(PipeController);
            
            let current_pos_x = start_pos_x + (i * this.pipeSpacing);
            
            pipeCtrl.init(this.node, current_pos_x);
            this.pipe_list.push(pipeCtrl);
        }
    }

    onPipeMove(deltaTime: number) {
        const leftBoundary = -view.getVisibleSize().width / 2 - 200;

        this.pipe_list.forEach((pipe) => {
            pipe.node.setPosition(pipe.node.position.x - this.speed * deltaTime, pipe.node.position.y, 0);

            if (pipe.node.position.x <= leftBoundary) {

                let maxX = leftBoundary;
                this.pipe_list.forEach(p => {
                    if (p.node.position.x > maxX) {
                        maxX = p.node.position.x;
                    }
                });

                pipe.onResetPosition(maxX + this.pipeSpacing);
            }
        });
    }
}