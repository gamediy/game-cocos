
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Label,Node } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";


const {ccclass, property} = _decorator;

@ccclass
export default class AlertPrefab extends Component {

    @property(Label)
    contnet:Label=null
    @property(Node)
    button:Node=null
    start () {
       
    }
    Alert(contnet:string,fun?:Function){
      
      this.contnet.string=contnet
  
      if(fun){
          this.button.on(Node.EventType.TOUCH_END,(event,data)=>{
              this.node.destroy()
            fun(event,data)
          })
      }
      else{

          this.button.on(Node.EventType.TOUCH_END,(event,data)=>{
            this.node.destroy()

          })
      }
    }
     onDestroy() {
        this.button.off(Node.EventType.TOUCH_END,()=>{})
    }
    // update (dt) {}
}
