import {
  _decorator,
  Canvas,
  Component,
  director,
  Node,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;
import { GameCtrl } from "./GameCtrl";
@ccclass("Ground")
export class Ground extends Component {
  @property({
    type: Node,
    tooltip: "First ground",
  })
  public ground1: Node;

  @property({
    type: Node,
    tooltip: "Second ground",
  })
  public ground2: Node;

  @property({
    type: Node,
    tooltip: "Third ground",
  })
  public ground3: Node;

  public groundWidth1: number;
  public groundWidth2: number;
  public groundWidth3: number;

  //make temporary starting locations
  public tempStartLocation1 = new Vec3();
  public tempStartLocation2 = new Vec3();
  public tempStartLocation3 = new Vec3();

  public gameSpeed: number;
  public gameCtrlSpee = new GameCtrl();
  onLoad() {
    this.startUp();
  }

  startUp() {
    //get ground width
    this.groundWidth1 = this.ground1.getComponent(UITransform).width;
    this.groundWidth2 = this.ground2.getComponent(UITransform).width;
    this.groundWidth3 = this.ground3.getComponent(UITransform).width;

    //set temporary starting locations of ground
    this.tempStartLocation1.x = 0;
    this.tempStartLocation2.x = this.groundWidth1;
    this.tempStartLocation3.x = this.groundWidth1 + this.groundWidth2;

    //update position to final starting locations
    this.ground1.setPosition(this.tempStartLocation1);
    this.ground2.setPosition(this.tempStartLocation2);
    this.ground3.setPosition(this.tempStartLocation3);
  }

  update(deltaTime: number) {
    this.gameSpeed = this.gameCtrlSpee.speed;
    // Update positions for ground nodes based on speed and deltaTime
    this.tempStartLocation1 = this.ground1.position.clone();
    this.tempStartLocation2 = this.ground2.position.clone();
    this.tempStartLocation3 = this.ground3.position.clone();

    // Move the ground pieces to the left based on game speed
    this.tempStartLocation1.x -= this.gameSpeed * deltaTime;
    this.tempStartLocation2.x -= this.gameSpeed * deltaTime;
    this.tempStartLocation3.x -= this.gameSpeed * deltaTime;

    const totalGroundWidth =
      this.groundWidth1 + this.groundWidth2 + this.groundWidth3;

    // Check if ground1 is off the screen and move it to the end of the last ground
    if (this.tempStartLocation1.x <= -this.groundWidth1) {
      this.tempStartLocation1.x = Math.max(
        this.tempStartLocation2.x + this.groundWidth2,
        this.tempStartLocation3.x + this.groundWidth3
      );
    }

    // Check if ground2 is off the screen and move it to the end of the last ground
    if (this.tempStartLocation2.x <= -this.groundWidth2) {
      this.tempStartLocation2.x = Math.max(
        this.tempStartLocation1.x + this.groundWidth1,
        this.tempStartLocation3.x + this.groundWidth3
      );
    }

    // Check if ground3 is off the screen and move it to the end of the last ground
    if (this.tempStartLocation3.x <= -this.groundWidth3) {
      this.tempStartLocation3.x = Math.max(
        this.tempStartLocation1.x + this.groundWidth1,
        this.tempStartLocation2.x + this.groundWidth2
      );
    }

    // Set the updated positions for the ground pieces
    this.ground1.setPosition(this.tempStartLocation1);
    this.ground2.setPosition(this.tempStartLocation2);
    this.ground3.setPosition(this.tempStartLocation3);
  }
}
