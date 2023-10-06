import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { resources } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    @property(Prefab) hall
    @property(Prefab) login
    start() {
        console.info("main")
        setTimeout(()=>{
            this.node.addChild(instantiate(this.hall))
        },1000)
     
        //   let res=  resources.load("hall/hall",Prefab,(err,res)=>{
        //         if (res!=null){

        //             this.node.addChild(instantiate(res))
        //         }
        //     })
            
    }

    update(deltaTime: number) {
        
    }
}


