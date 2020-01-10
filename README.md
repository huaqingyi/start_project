## cocos creator demo
### store
#### scripts/config/mobx.ts
```
import { configure } from 'mobx';

configure({ enforceActions: 'observed' });
```

### scripts/Game.ts
```
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import { action, observable } from 'mobx';
import { observer, react, reactor, render } from 'mobx-cocos';
import './config/mobx';
import { store } from './store';

@ccclass
@observer
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    public starPrefab!: cc.Prefab;

    // 星星产生后消失时间的随机范围
    @property
    public maxStarDuration: number;
    @property
    public minStarDuration: number;

    @property(cc.Node)
    public ground!: cc.Node;

    @property(cc.Node)
    public player!: cc.Node;

    @property(cc.Label)
    public scoreDisplay!: cc.Label;

    @property(cc.AudioClip)
    public scoreAudio!: cc.AudioClip;

    public groundY: number;
    public score: number;
    public timer: number;
    public starDuration: number;

    @observable
    private index: number;

    constructor() {
        super();
        this.maxStarDuration = 0;
        this.minStarDuration = 0;
        this.groundY = 0;
        this.score = 0;
        this.timer = 0;
        this.starDuration = 0;
        this.index = 0;
    }

    public spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        const newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    public getNewStarPosition() {
        let randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        const randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        const maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    }

    // LIFE-CYCLE CALLBACKS:

    public onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;

        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;

        // 生成一个新的星星
        this.spawnNewStar();
        // 初始化计分
        this.score = 0;

        this.schedule(this.addIndex, 1);
    }

    public start() {
        //
    }

    public update(dt: number) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    public gameOver() {
        this.player.stopAllActions(); // 停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    }

    public gainScore() {
        this.score += 1;
        this.scoreDisplay.string = `Score: ${this.score}`;

        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    @render
    protected renderCounter() {
        console.log(`store.counter ${store.counter}`);
    }

    // 监听 store.shadowCounter
    @render
    protected renderShadowCounter() {
        console.log(`store.shadowCounter ${store.shadowCounter}`);
    }

    // 监听 store.array[this.index % store.array.length] 的数值, 来修改 store.counter的数值
    @reactor
    protected componentCounterReactor() {
        return react(() => store.array[this.index % store.array.length], (value) => store.counter = value);
    }

    /**
     * 如下方式的简写
     * @reactor fn(){
     *    return react(()=> store.counter, (v)=> store.shadowCounter = v)
     * }
     */
    @reactor(() => store.counter)
    protected counterReactor(counter: number) {
        store.shadowCounter = counter;
    }

    @action
    private addIndex() {
        store.counter++;
    }
}

```