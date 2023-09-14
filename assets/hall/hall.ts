import { _decorator, Component, Node } from 'cc';
import ws from '../scrpts/ws'

const { ccclass, property } = _decorator;
   
@ccclass('hall')
export class hall extends Component {

    start() {
        let socket=new ws("ws://127.0.0.1:5001/socket?token=123a")
    }
  
    update(deltaTime: number) {
        
    }

  
}


