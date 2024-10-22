import {
  _decorator,
  CCFloat,
  Component,
  Node,
  Vec3,
  Animation,
  tween,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Bird")
export class Bird extends Component {
  @property({
    type: CCFloat,
    tooltip: " how high the bird jumps",
  })
  public jumpHeight: number = 3.5; // Độ cao mà bird nhảy

  @property({
    type: CCFloat,
    tooltip: "how fast the bird falls",
  })
  public jumpDuration: number = 0.5; // Thời gian bird nhảy
  public hitSomething: boolean;

  public birdAnimation: Animation; // Animation của bird
  public birdLocation: Vec3 = new Vec3(0, 0, 0); // Vị trí của bird

  onLoad() {
    // Khi bird được tạo
    this.resetBird();
    this.birdAnimation = this.node.getComponent(Animation);
  }

  resetBird() {
    this.birdLocation = new Vec3(0, 0, 0); // Đặt vị trí ban đầu
    this.node.setPosition(this.birdLocation); // Set vị trí của bird
    this.hitSomething = false;
  }

  fly() {
    this.birdAnimation.stop(); // Dừng animation (nếu cần)

    // Tạo tween di chuyển bird lên
    tween(this.node) // Sử dụng this.node thay vì this.node.position
      .to(
        this.jumpDuration,
        {
          position: new Vec3(
            this.node.position.x,
            this.node.position.y + this.jumpHeight,
            0
          ),
        },
        {
          easing: "smooth",
          onUpdate: (target: Node, ratio: number) => {
            this.node.setPosition(target.position);
          },
        }
      )
      .start();

    this.birdAnimation.play(); // Chạy lại animation (nếu cần)
  }
}
