// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import GClass from '../Game';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    public pickRadius: number;

    public game!: GClass;

    constructor() {
        super();
        this.pickRadius = 0;
    }

    public getPlayerDistance() {
        // 根据 player 节点位置判断距离
        const playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间距离
        const dist = this.node.position.sub(playerPos).mag();
        return dist;
    }

    public onPicked() {
        // 然后销毁当前星星节点
        this.node.destroy();
        // 调用 Game 脚本的得分方法
        this.game.gainScore();
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public start() {
        //
    }

    public update(dt: number) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }

        // 根据 Game 脚本中的计时器更新星星的透明度
        const opacityRatio = 1 - this.game.timer / this.game.starDuration;
        const minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
}
