import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('loading')
export class loading extends Component {

    loading:Node=null
    start() {
        this.loading=this.node.getChildByName("loading")
    }

    update(deltaTime: number) {
        this.loading.angle=this.loading.angle-200*deltaTime
    }
}


