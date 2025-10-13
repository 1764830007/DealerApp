import { NativeEventEmitter, NativeModule } from 'react-native';

// Create a dummy native module for the event emitter
const dummyNativeModule = new Proxy({}, {
    get: () => () => {},
}) as NativeModule;

class NetworkStateManager {
    private static instance: NetworkStateManager;
    private isOffline: boolean = false;
    public readonly events: NativeEventEmitter;

    private constructor() {
        // Create an EventEmitter with a dummy native module
        this.events = new NativeEventEmitter(dummyNativeModule);
    }

    public static getInstance(): NetworkStateManager {
        if (!NetworkStateManager.instance) {
            NetworkStateManager.instance = new NetworkStateManager();
        }
        return NetworkStateManager.instance;
    }

    public setIsOffline(value: boolean) {
        if (this.isOffline !== value) {
            this.isOffline = value;
            this.events.emit('networkStateChanged', value);
        }
    }

    public getIsOffline(): boolean {
        return this.isOffline;
    }

    // Method to add listeners with proper cleanup
    public addNetworkListener(callback: (isOffline: boolean) => void): () => void {
        const subscription = this.events.addListener('networkStateChanged', callback);
        return () => subscription.remove();
    }
}

export const networkManager = NetworkStateManager.getInstance();