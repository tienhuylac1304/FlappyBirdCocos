import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PipeController')
export class PipeController extends Component {

    // Không cần dùng EventManager ở đây, hàm sẽ được gọi thẳng từ BackgroundController
    
    init(parent: Node, position_x: number) {
        this.node.setParent(parent);
        
        // Gọi thẳng hàm reset để random độ cao ngay từ lúc khởi tạo
        this.onResetPosition(position_x);
    }
    
    onResetPosition(position_x: number) {
        // Áp dụng random làm tròn với step = 30 (các mốc: -60, -30, 0, 30, 60)
        let pos_y = Math.floor(Math.random() * 301) - 150;

        // Nếu bạn muốn random ngẫu nhiên mọi số từ -70 đến 70 thì dùng dòng dưới đây thay thế:
        // let pos_y = Math.floor(Math.random() * 141) - 70;

        this.node.setPosition(new Vec3(position_x, pos_y, 0));
    }
}