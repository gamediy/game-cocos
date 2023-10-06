import { Graphics } from "cc";
import { Vec3 } from "cc";
import { BlockInputEvents } from "cc";
import { Layers } from "cc";
import { Color } from "cc";
import { view,Node } from "cc";
import { UITransform } from "cc";


export default class uitls{
    public static createMask(name:string="window-mask"): Node {
        let maskNode = new Node(name);
        const uiTransform = maskNode.addComponent(UITransform);
        const screenSize = view.getVisibleSize();
        uiTransform.setContentSize(screenSize.width, screenSize.height);
        const graphics = maskNode.addComponent(Graphics);
        graphics.fillColor = new Color(0, 0, 0, 128); // 设置为半透明黑色
        graphics.fillRect(-screenSize.width / 2, -screenSize.height / 2, screenSize.width, screenSize.height);
        maskNode.setPosition(new Vec3(0, 0, 0));
        maskNode.active=true
        maskNode.layer = Layers.Enum.DEFAULT
        maskNode.addComponent(BlockInputEvents)
        return maskNode;
    }
   public static  generateRandomString(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    /**
     * 生成[min, max]范围内的随机整数。
     */
  public  static randomIntInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 生成UUID (Version 4)
     */

    public static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /**
     * 对数组进行洗牌
     */
    static shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // swap elements
        }
        return array;
    }

    /**
     * 获取节点的世界坐标
     */
    static getWorldPosition(node: Node): Vec3 {
        return node.getWorldPosition(new Vec3());
    }

    /**
     * 深拷贝对象
     */
    static deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
    /** 
    * 屏幕震动 (仅在支持的移动设备上)
    * duration: 震动的持续时间 (ms)
    */
   static vibrate(duration: number): void {
       if ('vibrate' in navigator) {
           navigator.vibrate(duration);
       }
   }
}
