import { _decorator, Component, Label, Node, tween, Tween, Vec3 } from "cc"; // Đã thêm các import cần thiết
import { EventManager } from "../manager/EventManager";
const { ccclass, property } = _decorator;

@ccclass("ResumePanelController")
export class ResumePanelController extends Component {
  @property({ type: Label, tooltip: "Countdown label" })
  countdownLabel: Label = null;

  countdownValue: number = 3;

  // Biến lưu trữ Tween hiện tại để quản lý và hủy
  private currentScaleTween: Tween<Node> = null;

  // onEnable tự động chạy mỗi khi node này được bật (active = true)
  onEnable() {
    // 1. Reset lại số 3 mỗi lần mở panel
    this.countdownValue = 3;

    // 2. Hiển thị ngay số 3 lên màn hình và CHƠI HIỆU ỨNG
    if (this.countdownLabel) {
      this.countdownLabel.string = this.countdownValue.toString();
      this.playScaleAnimation(); // Gọi hiệu ứng nảy số
    }

    // 3. Chạy hàm đếm ngược, lặp lại mỗi 1 giây
    this.schedule(this.runCountdown, 1);
  }

  // Đề phòng trường hợp Panel bị tắt đột ngột thì hủy bộ đếm và Tween
  onDisable() {
    this.unschedule(this.runCountdown);
    this.stopCurrentTween();
  }

  runCountdown() {
    this.countdownValue--;

    if (this.countdownValue > 0) {
      // Cập nhật chữ hiển thị (2, 1) và CHƠI HIỆU ỨNG
      if (this.countdownLabel) {
        this.countdownLabel.string = this.countdownValue.toString();
        this.playScaleAnimation(); // Gọi hiệu ứng nảy số
      }
    } else {
      // --- KHI ĐẾM NGƯỢC XONG (VỀ 0) ---
      this.unschedule(this.runCountdown); // Dừng bộ đếm
      this.stopCurrentTween(); // Dừng hiệu ứng

      // Phát sự kiện khôi phục vật lý, cho chim bay tiếp
      EventManager.instance.emit("continue-game");

      // Tắt hoàn toàn Node Panel đếm ngược
      this.node.active = false;
    }
  }

  // --- HÀM TẠO HIỆU ỨNG SỐ NẢY (POP-IN) ---
  private playScaleAnimation() {
    if (!this.countdownLabel) return;

    // Hủy Tween cũ nếu nó đang chạy dở
    this.stopCurrentTween();

    // 1. Ép Node chứa con số về kích thước cực nhỏ (gần như biến mất)
    this.countdownLabel.node.setScale(0.1, 0.1, 1.0);

    // 2. Tạo Tween để phóng to số lên kích thước bình thường (1, 1, 1)
    // - duration: 0.3 giây (nhanh và dứt khoát)
    // - easing: "backOut" (tạo hiệu ứng nảy nhẹ khi đạt kích thước target)
    this.currentScaleTween = tween(this.countdownLabel.node)
      .to(
        0.3,
        { scale: new Vec3(1.0, 1.0, 1.0) }, // Phóng về Scale 1
        { easing: "backOut" }, // Easing tạo cảm giác nảy
      )
      .start(); // Bắt đầu hiệu ứng
  }

  // Hàm dừng và hủy Tween an toàn
  private stopCurrentTween() {
    if (this.currentScaleTween) {
      this.currentScaleTween.stop();
      this.currentScaleTween = null;
    }
  }
}
