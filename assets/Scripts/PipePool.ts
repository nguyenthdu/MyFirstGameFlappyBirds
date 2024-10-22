import { _decorator, Component, instantiate, Node, NodePool, Prefab } from "cc";
import { Pipes } from "./Pipes";
const { ccclass, property } = _decorator;
@ccclass("PipePool")
export class PipePool extends Component {
  @property({
    type: Prefab,
  })
  public pipePrefabs = null;

  @property({
    type: Node,
  })
  public pipePoolHome;

  public pool = new NodePool();
  public createPipe: Node = null;
  onLoad() {
    this.initPool();
  }

  addPool() {
    console.log("Adding new pipe to pool");
    if (this.pool.size() > 0) {
      this.createPipe = this.pool.get();
      console.log("Got pipe from pool");
    } else {
      this.createPipe = instantiate(this.pipePrefabs);
      console.log("Created new pipe");
    }
    this.pipePoolHome.addChild(this.createPipe);
  }
  initPool() {
    let initCount = 3;

    for (let i = 0; i < initCount; i++) {
      let createPipe = instantiate(this.pipePrefabs);
      if (i == 0) {
        this.pipePoolHome.addChild(createPipe);
      } else {
        this.pool.put(createPipe);
      }
    }
  }

  reset() {
    this.pipePoolHome.removeAllChildren();
    this.pool.clear();
    this.initPool();
  }
}
