import { BroadcastSlot } from '../../types/abemagraph';
import { Channel } from '../../types/abema';

export interface StoreApp {
    channels: Channel[];
    broadcastSlots: BroadcastSlot[];
    broadcastSlotUpdated: number;
}


export interface Store {
    app: StoreApp;
}