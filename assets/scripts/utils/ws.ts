import { log } from "cc";
import { sys } from "cc";
import { error } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";


export default  class Ws {

    static event = {
        Error: "/error",
        Heartbeat: "/heartbeat",
        Login: "/user/login",
        Join: "/user/join",
        Quit: "/user/quit",
        Wallet: "/user/wallet",
        Enter: "/game/enter"
    };
    static wrapEventResponse(event:string){
        return event+"_response"
    }
    private static _instance: Ws = null;
    private socket: WebSocket;
    private url: string="ws://127.0.0.1:5000/socket";
    private heartbeatInterval: number;
    private reconnectInterval: number;
    private heartbeatTimer: number;
    private reconnectTimer: number;
    private eventListeners: { [key: string]: Function[] } = {};  // 事件监听器

    private messageQueue: any[] = [];
    private sendFromQueue() {
        while (this.socket.readyState === WebSocket.OPEN && this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.socket.send(message);
        }
    }

     constructor(heartbeatInterval = 30000, reconnectInterval = 5000) {
        
        let token=sys.localStorage.getItem("token")
        if(token){
            this.url+="?token="+token
            this.heartbeatInterval = heartbeatInterval;
            this.reconnectInterval = reconnectInterval;
            this.connect();
        }
      
      
    }
    public emitEvent(eventName: string, data: any) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => callback(data));
        }
    }
       // 添加监听函数
       public on(eventName: string, callback: Function) {
      
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }
  /**
     * 移除一个事件类型下的所有监听，或移除所有事件的所有监听。
     * 
     * @param eventName - 要移除的事件类型。如果未指定，则移除所有事件的所有监听。
     */
  public removeAllListeners(eventName?: string) {
    if (eventName) {
        if (this.eventListeners[eventName]) {
            delete this.eventListeners[eventName];  // 移除特定事件的所有监听
        }
    } else {
        this.eventListeners = {};  // 一次性移除所有监听
    }
}
        // 移除监听函数
        public off(eventName: string, callback: Function) {
            if (this.eventListeners[eventName]) {
                const index = this.eventListeners[eventName].indexOf(callback);
                if (index !== -1) {
                    this.eventListeners[eventName].splice(index, 1);
                }
            }
        }

        public sendEvent(eventName:string,query:any){
            if (this.socket.readyState !== WebSocket.OPEN) {
                let message = JSON.stringify({ event: eventName, query: query });
                this.messageQueue.push(message);
                log(`socket not open: ${eventName}`);
                
                return;
            }
            this.socket.send(JSON.stringify({ event: eventName, query: query }));
        }
           // 封装发送消息方法
           public sendEventAsync(eventName: string, query: any): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.socket.readyState !== WebSocket.OPEN) {
                    let message = JSON.stringify({ event: eventName, query: query });
                    this.messageQueue.push(message);
                    reject(new Error(`Socket not open ${eventName}`));
                    return;
                }
                // 注册一个一次性事件监听器
                const responseEventName = `${eventName}_response`;
                const listener = (event: MessageEvent) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.event === responseEventName) {
                            this.socket.removeEventListener('message', listener); // 移除监听器
                            resolve(data.body);  // 返回数据
                        }
                    } catch (e) {
                        // 处理可能出现的错误，例如JSON解析错误
                        reject(e);
                    }
                };
        
                this.socket.addEventListener('message', listener);
        
                // 发送消息
                this.socket.send(JSON.stringify({ event: eventName, query: query }));
        
                // 如果在指定的超时时间内没有收到响应，解除promise
                setTimeout(() => {
                    this.socket.removeEventListener('message', listener);
                    reject(new Error('WebSocket response timeout'));
                }, 5000);  // 例如，5秒超时
            });
        }

    private connect() {
        console.info(this.url)
        this.socket = new WebSocket(this.url);

        this.socket.onopen = (event) => {
            console.info('WebSocket is open now.');
            this.socket.send(JSON.stringify({event:"/user/login"}))
            this.stopReconnect()
            this.startHeartbeat();
            this.sendFromQueue();
            
        };

        this.socket.onclose = (event) => {
            log('WebSocket is closed now.');
           this.messageQueue=[]
           
            this.stopHeartbeat();
            this.startReconnect();
        };

        this.socket.onerror = (event) => {
            error('WebSocket error observed:', event);
            this.messageQueue=[]
            this.stopHeartbeat();
            this.stopReconnect();
        };

        this.socket.onmessage = (event) => {
            

            try {
                const message = JSON.parse(event.data);
                if (message.event) {
                    this.emitEvent(message.event, message.body);
                } else {
                    log('WebSocket received unrecognized message:', event);
                }
            } catch (e) {
                error(`Error processing WebSocket message: ${e.message}`);
            }
        };
    }

    private startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {

            this.socket.send(JSON.stringify({event:"/heartbeat"}));
        }, this.heartbeatInterval);
    }

    private stopHeartbeat() {
        clearInterval(this.heartbeatTimer);
    }

    private startReconnect() {
        this.reconnectTimer = setInterval(() => {
            log('Attempting to reconnect...');
            this.connect();
        }, this.reconnectInterval);
    }

    private stopReconnect() {
        clearInterval(this.reconnectTimer);
    }

    send(data: string) {
        this.socket.send(data);
    }

    close() {
        this.socket.close();
    }

    public static getInstance(): Ws {
        if (this._instance === null) {
            this._instance = new Ws();
        }
        
        return this._instance;
    }
    
  
}