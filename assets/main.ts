import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { resources } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    @property(Prefab) hall
    start() {
        console.info("main")
       this.node.addChild(instantiate(this.hall))
        //   let res=  resources.load("hall/hall",Prefab,(err,res)=>{
        //         if (res!=null){

        //             this.node.addChild(instantiate(res))
        //         }
        //     })
            
    }

    update(deltaTime: number) {
        
    }
}


