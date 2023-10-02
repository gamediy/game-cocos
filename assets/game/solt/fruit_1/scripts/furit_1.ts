import { instantiate } from 'cc';
import { Vec3 } from 'cc';
import { Tween } from 'cc';
import { AudioClip } from 'cc';
import { Button } from 'cc';
import { AudioSource } from 'cc';
import { easing } from 'cc';
import { tween } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
    @property([Prefab]) object: Prefab[] = [];

    @property(AudioClip)
    public won: AudioClip = null!;   
    @property(AudioClip)
    public sp: AudioClip = null!;  
 
    @property(AudioSource)
    public audioSource: AudioSource = null!;

    body:Node=null
    total:number=30
    
    distance: number=0
    openResult:number[]=[]
    winTween:Tween<Node>[]=[]

    spinBtn: Node | null = null; 

    start() {
        this.distance=-(this.total/3*520-520)
        this.body=this.node.getChildByName("body")
        this.init()
        this.spinBtn=this.node.getChildByPath("bet/spin")
        this.spinBtn.on(Node.EventType.TOUCH_END,this.spin,this)
    }

    init(){
        this.body.children.forEach((column,index)=>{
            column.removeAllChildren()
            for (let i = 1; i < this.total; i++) {
                this.createNode(column);
            }

        })
    }
    createNode(parentNode: Node) {
        const randomInt = Math.floor(Math.random() * 3);
        const pb = this.object[randomInt];
        const node = instantiate(pb);
        parentNode.addChild(node);
    }
    spin() {
        this.spinBtn.off(Node.EventType.TOUCH_END,this.spin,this)
        this.audioSource.playOneShot(this.sp, 1);
        const columns = this.body.children
        this.openResult=[1,1,1] //从服务器获取
        columns.forEach((item,index)=>{
            let gametList=item.children
            gametList[gametList.length-2].destroy()
            item.insertChild(instantiate(this.object[this.openResult[index]]),gametList.length-1)
        })

        this.winTween.forEach(item=>{
            item.stop
        })

        const staggerInterval = 0.3;  // 每个列之间停止的时间间隔
        columns.forEach((column, index) => {
            tween(column)
                // 加速阶段
                .by(3+(index*0.5), { position: new Vec3(0, this.distance, 0) }, { easing: easing.quadOut  })
                .call(()=>{
                    if(index==2){
                        this.checkResult()
                        this.nextInit()
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
            const columns = this.body.children
            columns.forEach(item=>{
                let gameList=item.children
                let count=gameList.length
                console.info(gameList.length)

                for(let i=0;i<26;i++){
                    let n=gameList[i]
                    n.destroy()
                }
                
                for(let j=0;j<count-3;j++){
                    const randomInt = Math.floor(Math.random() * 3);
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
            this.audioSource.playOneShot(this.won, 1);
            let game=this.body.children
            game.forEach(item=>{
                let winNode=item.children[item.children.length-2]
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
    update(deltaTime: number) {
        
    }
}


