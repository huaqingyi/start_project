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

@ccclass
export default class NewClass extends cc.Component {

    // 主角跳跃高度
    @property
    public jumpHeight: number;

    @property
    // 主角跳跃持续时间
    public jumpDuration: number;

    // 最大移动速度
    @property
    public maxMoveSpeed: number;

    // 加速度
    @property
    public accel: number;

    // 跳跃音效资源
    @property(cc.AudioClip)
    public jumpAudio!: cc.AudioClip;

    public accLeft?: boolean;
    public accRight?: boolean;

    public xSpeed: number;

    constructor() {
        super();
        this.jumpHeight = 0;
        this.jumpDuration = 0;
        this.maxMoveSpeed = 0;
        this.accel = 0;
        this.xSpeed = 0;
    }

    public setJumpAction() {
        // 跳跃上升
        const jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        const jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        const callback = cc.callFunc(this.playJumpSound, this);
        console.log(1);
        // 不断重复
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    }

    public playJumpSound() {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    // LIFE-CYCLE CALLBACKS:

    public onLoad() {
        // 初始化跳跃动作
        this.node.runAction(this.setJumpAction());

        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;

        // 主角当前水平方向速度
        this.xSpeed = 0;

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    public onKeyDown(event: cc.Event.EventKeyboard) {
        // set a flag when key pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    }

    public onKeyUp(event: cc.Event.EventKeyboard) {
        // unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    }

    public onDestroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    public start() {
        //
    }

    public update(dt: number) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
    }
}
