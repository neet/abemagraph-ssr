import { BroadcastSlot } from '../../types/abemagraph';

export interface StoreApp {
    broadcastSlots: BroadcastSlot[];
    broadcastSlotUpdated: number;
}

export interface Store {
    app: StoreApp;
}