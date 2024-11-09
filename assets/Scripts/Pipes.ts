import {
  _decorator,
  Component,
  Node,
  Vec3,
  screen,
  find,
  UITransform,
  view,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Pipes")
export class Pipes extends Component {
  @property({
    type: Node,
    tooltip: "Top pipe",
  })
  public topPipe: Node;

  @property({
    type: Node,
    tooltip: "Bottom pipe",
  })
  public bottomPipe: Node;

  private readonly MIN_GAP = 150; // Khoảng cách giữa hai ống
  private readonly MAX_GAP = 200;
  private readonly MIN_HEIGHT = 100; // Chiều cao của ống
  private readonly MAX_HEIGHT = 350;

  private tempStartLocationUp: Vec3;
  private tempStartLocationDown: Vec3;
  private viewSize = view.getVisibleSize();
  private game;
  private pipeSpeed: number;
  private tempSpeed: number;
  private isPass: boolean = false;

  onLoad() {
    this.tempStartLocationUp = new Vec3(0, 0, 0);
    this.tempStartLocationDown = new Vec3(0, 0, 0);

    this.game = find("GameCtrl").getComponent("GameCtrl"); // Tìm gameCtrl để lấy thông số tốc độ ống
    this.pipeSpeed = this.game.pipeSpeed;

    this.initPos();
  }

  initPos() {
    // Đặt vị trí bắt đầu ở ngoài màn hình bên phải
    const startX = this.viewSize.width / 2;

    // Tạo khoảng cách ngẫu nhiên giữa hai ống
    const gap = Math.random() * (this.MAX_GAP - this.MIN_GAP) + this.MIN_GAP;
    const topHeight =
      Math.random() * (this.MAX_HEIGHT - this.MIN_HEIGHT) + this.MIN_HEIGHT;

    this.tempStartLocationUp.x = startX;
    this.tempStartLocationUp.y = topHeight;

    this.tempStartLocationDown.x = startX;
    this.tempStartLocationDown.y = topHeight - gap;

    this.topPipe.setPosition(this.tempStartLocationUp);
    this.bottomPipe.setPosition(this.tempStartLocationDown);
  }

  update(dt: number) {
    // Cập nhật vị trí mới
    this.tempSpeed = this.pipeSpeed * dt;

    this.tempStartLocationDown = this.bottomPipe.position.clone();
    this.tempStartLocationUp = this.topPipe.position.clone();

    this.tempStartLocationDown.x -= this.tempSpeed;
    this.tempStartLocationUp.x -= this.tempSpeed;

    this.bottomPipe.setPosition(this.tempStartLocationDown);
    this.topPipe.setPosition(this.tempStartLocationUp);

    // Kiểm tra để tính điểm
    if (!this.isPass && this.topPipe.position.x <= 0) {
      this.isPass = true;
      this.game.passPipe();
    }

    console.log("size: " + this.viewSize.width);
    console.log("top pipe:" + this.topPipe.position.x);
    if (
      this.topPipe.position.x <=
      -this.viewSize.width / 2 -
        this.topPipe.getComponent(UITransform).width * 2
    ) {
      this.game.createPipe();
      this.node.destroy();
    }
  }
}
