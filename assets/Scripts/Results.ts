import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Results")
export class Results extends Component {
  @property({
    type: Label,
  })
  public scoreLabel: Label;
  @property({
    type: Label,
    tooltip: "High Score",
  })
  public highScore: Label;

  @property({
    type: Label,
    tooltip: "Try Again?",
  })
  public resultEnd: Label;

  maxScore: number = 0;
  currentScore: number = 0;

  updateScore(score: number) {
    this.currentScore = score;
    this.scoreLabel.string = " " + this.currentScore;
  }
  resetScore() {
    this.updateScore(0);
    this.hideResults();
    this.scoreLabel.string = " " + this.currentScore;
  }

  addScore() {
    this.updateScore(this.currentScore + 1);
  }
  showResults() {
    this.maxScore = Math.max(this.maxScore, this.currentScore);
    this.highScore.string = "High Score: " + this.maxScore;
    this.highScore.node.active = true;
    this.resultEnd.node.active = true;
  }
  hideResults() {
    this.highScore.node.active = false;
    this.resultEnd.node.active = false;
  }
}
