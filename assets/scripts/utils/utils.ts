import { Graphics } from "cc";
import { Vec3 } from "cc";
import { BlockInputEvents } from "cc";
import { Layers } from "cc";
import { Color } from "cc";
import { view,Node } from "cc";
import { UITransform } from "cc";


export class uitls{
    public static createMask(): Node {
        // 创建新的节点并命名为"DynamicMask"
        let maskNode = new Node('window-mask');
        
        // 为节点添加UITransform组件，并设置其大小
        const uiTransform = maskNode.addComponent(UITransform);
        const screenSize = view.getVisibleSize();
        uiTransform.setContentSize(screenSize.width, screenSize.height);
    
        // 为节点添加Graphics组件，绘制一个半透明的矩形作为遮罩
        const graphics = maskNode.addComponent(Graphics);
        graphics.fillColor = new Color(0, 0, 0, 128); // 设置为半透明黑色
        graphics.fillRect(-screenSize.width / 2, -screenSize.height / 2, screenSize.width, screenSize.height);
    
        // 将节点放置在屏幕中央
        maskNode.setPosition(new Vec3(0, 0, 0));
        maskNode.active=true
        maskNode.layer = Layers.Enum.DEFAULT
        maskNode.addComponent(BlockInputEvents)
        return maskNode;
    }
}
