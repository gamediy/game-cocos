

const { ccclass, property } = cc._decorator;

@ccclass
export default class ToastPrefab extends cc.Component {

    @property(cc.Label)
    string: cc.Label
    start() {
    }
    show(string: string, time: number = 3, fun?: Function) {
        this.string.string = string
        this.scheduleOnce(() => {
            if (fun) {
                fun(this.node)
            }
            this.node.destroy()

        }, time)
    }

}
