import { view } from 'cc';
import { Color } from 'cc';
import { Vec3 } from 'cc';
import { Graphics } from 'cc';
import { UITransform } from 'cc';
import { window } from '../../../scripts/utils/window';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('login')
export class login extends Component {
    start() {
        
    }

    update(deltaTime: number) {
        
    }
    
    close(){
       window.close(this.node)
    }
}


