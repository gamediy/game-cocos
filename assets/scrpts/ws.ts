import { log } from "cc";
import { error } from "cc";
import { Component } from "cc";
import { _decorator } from "cc";


const {ccclass, property} = _decorator;

@ccclass
export default class WebSocketWrapper extends Component {
    private socket: WebSocket;
    private url: string;
    private heartbeatInterval: number;
    private reconnectInterval: number;
    private heartbeatTimer: number;
    private reconnectTimer: number;

    constructor(url: string, heartbeatInterval = 3000, reconnectInterval = 5000) {
        super();
        this.url = url;
        this.heartbeatInterval = heartbeatInterval;
        this.reconnectInterval = reconnectInterval;
        this.connect();
    }

    private connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = (event) => {
            console.info('WebSocket is open now.');
            this.socket.send(JSON.stringify({event:"login"}))
            this.stopReconnect()
            this.startHeartbeat();
          
            
        };

        this.socket.onclose = (event) => {
            log('WebSocket is closed now.');
           
            this.stopHeartbeat();
            this.startReconnect();
        };

        this.socket.onerror = (event) => {
            error('WebSocket error observed:', event);
            this.stopHeartbeat();
            this.stopReconnect();
        };

        this.socket.onmessage = (event) => {
            log('WebSocket message received:', event);
        };
    }

    private startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {

            this.socket.send(JSON.stringify({event:"heartbeat"}));
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
}