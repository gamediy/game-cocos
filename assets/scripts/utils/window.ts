import { director } from "cc";
import uitls  from "./utils";
import {Node} from "cc"
import { Vec3 } from "cc";
import { tween } from "cc";
import { UIOpacity } from "cc";

export default class window{

    public static show(node:Node){
        console.info("open")
        node.setScale(new Vec3(0, 0, 1))
      
       let mask=uitls.createMask()
       mask.addChild(node)
       node.setScale(new Vec3(0, 0, 1))
       director.getScene().getChildByName("Canvas").insertChild(mask,3)
       tween(node)
            .parallel(
                tween().to(0.2, { scale: new Vec3(1.1, 1.1, 1), opacity: 255 }),  // 快速放大并完全不透明
                tween().by(0.2, { position: new Vec3(0, -10, 0) }),
                tween().to(0.3, { opacity: 255 })  // 微小的下移动画
            )
            .to(0.3, { scale: new Vec3(1, 1, 1) })  // 回到原始大小
            .start()

    }

    public static close(node:Node){
        tween(node)
        .to(0.3, { scale: new Vec3(0, 0, 1) })  // 在0.3秒内缩小到0
        .call(() => {
            node.destroy()
            const maskNode = director.getScene().getChildByPath("Canvas/window-mask");
            if (maskNode) {
                maskNode.destroy();  // 销毁mask节点
            }
          
        })
        .start();
       
    }
}