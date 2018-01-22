import { SlotAudienceItem, SlotAudience } from '../types/abema';
import { api } from '../utils/abema';

export const getSlotAudience = async (...slotIds: string[]) => {
    const response = await api<SlotAudience>('slotAudience', 'GET', { slotIds: slotIds.join(',') });
    return response.slotAudiences;
};