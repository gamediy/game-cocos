import { instantiate } from 'cc';
import { EventTouch } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import ws from "../../scripts/utils/ws"
import uitls  from "../../scripts/utils/utils"
import window  from "../../scripts/utils/window"
import Http from '../../scripts/utils/http';
import { director } from 'cc';
import { UITransform } from 'cc';
import { view } from 'cc';
import { Graphics } from 'cc';
import { Color } from 'cc';
import { Vec3 } from 'cc';
import { Layers } from 'cc';
import { sys } from 'cc';
import { Label } from 'cc';




const { ccclass, property } = _decorator;

@ccclass('hall')
export class hall extends Component {
    @property(Prefab) login
    @property({type:[Prefab]}) gameList:Prefab[]=[]


    token:string=""
    deviceId:string=""
    wsUrl:string=""
    start() {
        console.info("hall")
        this.deviceId=sys.localStorage.getItem("device_id")
        this.token=sys.localStorage.getItem("token")
        if(!this.token){
            if(!this.deviceId){
                this.deviceId=uitls.generateRandomString(32)
            }
            if (this.deviceId){
                sys.localStorage.setItem("device_id",this.deviceId)
                Http.post("/api/login",{
                    deviceId:this.deviceId
                }).then(data=>{
                    sys.localStorage.setItem("token",data.data)
                    ws.getInstance()
                })
            }
        }
        if (this.token){
            ws.getInstance()
        }
      
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
        ws.getInstance().on(ws.wrapEventResponse(ws.event.Login),(res)=>{
            console.info(res)
            this.node.getChildByPath("header/left/account").getComponent(Label).string=res.data.userInfo.account
            this.node.getChildByPath("header/left/amount/blance").getComponent(Label).string=res.data.wallet.balance
        })
      
    }

    update(deltaTime: number) {
        
    }

    loginFun(){

    }

    openLogin(){
        ws.getInstance().sendEventAsync(ws.event.Wallet,null).then(res=>{
            console.info("res wallet",res.data.balance)
        }).catch(err=>{
            console.info(err)
        })
        console.info("open login")
        window.show(instantiate(this.login))
    }
  
}


