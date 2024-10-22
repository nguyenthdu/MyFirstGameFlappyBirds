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

  private readonly MIN_GAP = 150;
  private readonly MAX_GAP = 200;
  private readonly MIN_HEIGHT = 100;
  private readonly MAX_HEIGHT = 350;

  private tempStartLocationUp: Vec3;
  private tempStartLocationDown: Vec3;
  private viewSize;
  private game;
  private pipeSpeed: number;
  private tempSpeed: number;
  private isPass: boolean = false;

  onLoad() {
    this.tempStartLocationUp = new Vec3(0, 0, 0);
    this.tempStartLocationDown = new Vec3(0, 0, 0);

    this.viewSize = view.getVisibleSize();
    this.game = find("GameCtrl").getComponent("GameCtrl");
    this.pipeSpeed = this.game.pipeSpeed;

    this.initPos();
  }

  initPos() {
    // Đặt vị trí bắt đầu ở ngoài màn hình bên phải
    const startX = this.viewSize.width;

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

    // Chỉ destroy pipe khi nó đã đi qua hoàn toàn màn hình
    const pipeWidth = this.topPipe.getComponent(UITransform).width;
    const destroyPoint = -this.viewSize.width; // Tạo ống mới khi ống

    if (this.topPipe.position.x <= destroyPoint) {
      console.log("Destroying pipe at position:", this.topPipe.position.x);
      this.game.createPipe();
      this.node.destroy();
    }
  }
}
