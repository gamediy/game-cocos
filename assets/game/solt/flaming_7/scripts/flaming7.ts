import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { Widget } from 'cc';
import { SpriteFrame, Vec3, tween, UITransform, EventTouch, Sprite, easing, Component, Node, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('flaming7')
export class flaming7 extends Component {

    @property([Prefab]) object: Prefab[] = [];
    @property(Node) c1:Node
    @property(Node) c2:Node
    @property(Node) c3:Node
    @property(Node) body:Node
    distance: number=-6000+600
  
    total:number=30
    start() {
            this.init()
            this.node.getChildByName("Button").on(Node.EventType.TOUCH_END,()=>{
                this.spin()
            },this)
    }



    init(){
     
        const columns = [this.c1, this.c2, this.c3];
        columns.forEach(column => {
            column.removeAllChildren()
            for (let i = 0; i < this.total; i++) {
                this.createNode(column);
            }
        });
    }

    createNode(parentNode: Node) {
        const randomInt = Math.floor(Math.random() * 3);
        const pb = this.object[randomInt];
        const node = instantiate(pb);
        parentNode.addChild(node);
    }
    update(deltaTime: number) {}

    scrollDown(node: Node) {
        
    }

    spin() {
       
        const staggerInterval = 0.3;  // 每个列之间停止的时间间隔
       
    
        const columns = [this.c1, this.c2, this.c3];
    
        columns.forEach((column, index) => {
            tween(column)
                // 加速阶段
                .by(3+(index*0.5), { position: new Vec3(0, this.distance, column.position.z) }, { easing: easing.quadOut  })
                .call(()=>{

                })
                // 延迟到下一个列开始减速
                .delay(index * staggerInterval)
                .start();
        });
    }
    
    
    
}








   

