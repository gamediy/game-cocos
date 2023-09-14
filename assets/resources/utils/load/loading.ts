// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Component, _decorator,Node } from "cc";

const {ccclass, property} = _decorator;

@ccclass
export default class LoadingPrefab extends Component {

    @property(Node)
    loading: Node = null;

    start () {
        
        
    }

    update (dt) {
        
        this.loading.angle=this.loading.angle-200*dt
    }
}
