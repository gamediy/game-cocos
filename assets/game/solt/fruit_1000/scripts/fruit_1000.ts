import { instantiate } from 'cc';
import { tween } from 'cc';
import { easing } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { UITransform } from 'cc';
import { Vec3 } from 'cc';
import { Tween } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import window  from "../../../../scripts/utils/window"
import Events from "../../../../scripts/eventbus"
import { Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('fruit_1000')
export class fruit_1000 extends Component {
    @property([Prefab]) object: Prefab[] = []
    @property(Prefab) bet:Prefab
    game:Node
    @property(SpriteFrame) fireSF:SpriteFrame
    @property(Node) showBet:Node

    total:number=30
    distance: number=0
    openResult:number[]=[]
    winTween:Tween<Node>[]=[]
    spinBtn: Node | null = null
    betBtn:Node
    start() {
        this.game=this.node.getChildByName("game")
        this.spinBtn=this.node.getChildByPath("bottom/spin")
        this.betBtn=this.node.getChildByPath("bottom/selectBetAmount")
        this.betBtn.on(Node.EventType.TOUCH_END,()=>{
            window.show(instantiate(this.bet))
            
        },this)
        this.spinBtn.on(Node.EventType.TOUCH_END,this.spin,this)
        let ui=this.game.children[0].getComponent(UITransform)
        console.info(ui.height)
        this.distance=-(this.total/(this.game.children.length)*580-480)
       
        this.init()
    
        Events.on("select_bet",(event)=>{
            console.info(event)
            let amount=this.node.getChildByPath("bottom/selectBetAmountShow/amount").getComponent(Label)
            amount.string=event
        })
    }
    createNode(parentNode: Node) {
        let randomInt = Math.floor(Math.random() * this.object.length);
        console.info(randomInt)
        let pb = this.object[randomInt];
        let node = instantiate(pb);
        parentNode.addChild(node);
    }

    spin() {
        let won=this.node.getChildByName("won")
        won.active=false
        this.spinBtn.off(Node.EventType.TOUCH_END,this.spin,this)
   
        const columns = this.game.children
        this.openResult=[1,1,1] //从服务器获取
        columns.forEach((item,index)=>{
           
            //插入开奖结果
            let gametList=item.children
            gametList[gametList.length-2].destroy()
            item.insertChild(instantiate(this.object[this.openResult[index]]),gametList.length-1)
        })

        this.winTween.forEach(item=>{
            item.stop
        })

        const staggerInterval = 0.3;  // 每个列之间停止的时间间隔
        columns.forEach((column, index) => {
            let ui=column.getComponent(UITransform)
            console.info(  column.getWorldPosition(new Vec3()))
            tween(column)
                // 加速阶段
                .by(this.game.children.length+(index*0.5), { position: new Vec3(0,this.distance , 0) }, { easing: easing.quadOut  })
                .call(()=>{
                    if(index==2){
                        this.checkResult()
                        this.nextInit()
                        tween(column).by(0.3,{ position: new Vec3(0,0 , 0) })
                    }
                   
                })
                // 延迟到下一个列开始减速
                .delay(index * staggerInterval)
                .start();
        });
    }
    nextInit(){
      
        this.spinBtn.on(Node.EventType.TOUCH_END,this.spin,this)
        if(this.openResult.length>0){
            const columns = this.game.children
            columns.forEach(item=>{
                let gameList=item.children
                let count=gameList.length //30
                console.info(gameList.length)

                for(let i=0;i<26;i++){
                    let n=gameList[i]
                    n.destroy()
                }
                
                for(let j=0;j<count-this.game.children.length;j++){
                    const randomInt = Math.floor(Math.random() * this.game.children.length);
                    item.addChild(instantiate(this.object[randomInt]))
                   
                }
                item.setPosition(new Vec3(item.position.x,0,0))

            })
        }
    }
    checkResult(){
        let allSame = this.openResult.every(value => value === this.openResult[0]);
        console.info(allSame)
        if(allSame){
            
            let won=this.node.getChildByName("won")
            won.active=true


            let game=this.game.children
            game.forEach(item=>{
                let winNode=item.children[item.children.length-2]
                // 检查winNode是否已有Sprite组件
let sprite = winNode.getComponent(Sprite);
if (!sprite) {
    console.info("add sprite1")
    sprite = winNode.addComponent(Sprite);
}

if (this.fireSF) {
    console.info("add sprite2")
    sprite.spriteFrame = this.fireSF;
} else {
    console.error("fireSF is not loaded or assigned!");
}
                console.info(winNode)
               let win= tween(winNode)
                .sequence(
                    tween().to(0.5, { scale: new Vec3(1.2, 1.2, 1.2) }),  // 缩放到 1.2 倍
                    tween().to(0.5, { scale: new Vec3(0.8, 0.8, 0.8) })   // 缩放到 0.8 倍
                )
                .repeatForever()  // 使动画无限重复
                .start();
                this.winTween.push(win)
                
            })
        }
        


    }
    init(){

        console.info(this.total)
        this.game.children.forEach((column,index)=>{
            column.removeAllChildren()
            for (let i = 1; i < this.total; i++) {
                this.createNode(column);
            }

        })
    }
    update(deltaTime: number) {
        
    }


}


