import { instantiate } from 'cc';
import { EventTouch } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';

import {uitls}  from "../../scripts/utils/utils"
import {window}  from "../../scripts/utils/window"

import { director } from 'cc';
import { UITransform } from 'cc';
import { view } from 'cc';
import { Graphics } from 'cc';
import { Color } from 'cc';
import { Vec3 } from 'cc';
import { Layers } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('hall')
export class hall extends Component {
    @property(Prefab) login
    @property({type:[Prefab]}) gameList:Prefab[]=[]
    start() {

      
        console.info("hall")

        let game=this.node.getChildByName("game").children
        //loading.show()
        console.info(this.gameList)
        for (let i = 0; i < game.length; i++) {
            let item = game[i];
            item.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{

                let n=this.gameList[i]
                    //console.info(this.gameList[i])
                  this.node.addChild(instantiate(this.gameList[i]))
                 
            })
            
        }
      
    }

    update(deltaTime: number) {
        
    }

    openLogin(){
        console.info("open login")
        window.show(instantiate(this.login))
    }
  
}


