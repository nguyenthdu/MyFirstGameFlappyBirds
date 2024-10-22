import {
  _decorator,
  CCInteger,
  Collider2D,
  Component,
  Contact2DType,
  director,
  EventKeyboard,
  Input,
  input,
  IPhysics2DContact,
  KeyCode,
  Node,
} from "cc";
import { Ground } from "./Ground";
import { Results } from "./Results";
import { Bird } from "./Bird";
import { PipePool } from "./PipePool";
import { BirdAudio } from "./BirdAudio";
const { ccclass, property } = _decorator;

@ccclass("GameCtrl")
export class GameCtrl extends Component {
  @property({
    type: Ground,
    tooltip: "this is ground",
  })
  public ground: Ground;

  @property({
    type: CCInteger,
  })
  public speed: number = 300;

  @property({
    type: CCInteger,
  })
  public pipeSpeed: number = 200;
  public isOver: boolean;

  @property({
    type: Results,
    tooltip: "this is results",
  })
  public results: Results;

  @property({
    type: Bird,
    tooltip: "this is bird",
  })
  public bird: Bird;
  @property({
    type: PipePool,
    tooltip: "this is pipePool",
  })
  public pipeQueue: PipePool;
  @property({
    type: BirdAudio,
  })
  public clip: BirdAudio;
  onLoad() {
    this.initListener();
    this.results.resetScore();
    director.pause(); // Dừng game khi chưa bắt đầu
    this.isOver = true;
  }

  initListener() {
    // input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

    // Lắng nghe sự kiện click chuột để bird bay lên
    input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
      if (event.keyCode === KeyCode.SPACE) {
        if (this.isOver == true) {
          this.resetGame();
          this.bird.resetBird();
          this.startGame();
        }
        if (this.isOver == false) {
          this.bird.fly();
          this.clip.onAudioQueue(0);
        }
      }
    });
  }

  //   onKeyDown(event: EventKeyboard) {
  //     switch (event.keyCode) {
  //       case KeyCode.KEY_A:
  //         this.gameOver();

  //         break;
  //       case KeyCode.KEY_P:
  //         this.results.addScore();

  //         break;
  //       case KeyCode.KEY_Q:
  //         this.resetGame();
  //         this.bird.resetBird();
  //     }
  //   }

  gameOver() {
    this.results.showResults();
    director.pause(); // Dừng game khi kết thúc
    this.isOver = true;
    this.pipeQueue.reset();
    this.clip.onAudioQueue(3);
  }

  resetGame() {
    this.results.resetScore();
    this.startGame();
    this.pipeQueue.reset();
    this.isOver = false;
    this.pipeQueue.reset();
  }

  startGame() {
    this.results.hideResults();
    director.resume();
    this.pipeQueue.addPool(); // Tạo pipe đầu tiên
    console.log("Game started, first pipe created");
    this.pipeQueue.reset();
  }
  passPipe() {
    this.results.addScore();
    this.clip.onAudioQueue(1);
  }
  createPipe() {
    this.pipeQueue.addPool();
  }
  contactGroundPipe() {
    let collider = this.bird.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }
  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    this.bird.hitSomething = true;
    this.clip.onAudioQueue(2);
  }
  birdStruck() {
    this.contactGroundPipe();
    if (this.bird.hitSomething) {
      this.gameOver();
    }
  }
  update() {
    if (this.isOver == false) {
      this.birdStruck();
    }
  }
}
