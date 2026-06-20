import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
    connectionStatus: 'disconnected', // connecting, connected, disconnected
    currentDevice: null,
    connectedDevices: [],
    selectedPeer: null,
    messages: {}, // { sortedKey: [...messages] }
    trustedDevices: [],

    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setCurrentDevice: (device) => set({ currentDevice: device }),
    setConnectedDevices: (devices) => set({ connectedDevices: devices }),
    setSelectedPeer: (deviceId) => set({ selectedPeer: deviceId }),

    addMessage: (from, to, content) =>
        set((state) => {
            const key = [from, to].sort().join('-');
            const existing = state.messages[key] || [];
            const myId = state.currentDevice?.id;
            return {
                messages: {
                    ...state.messages,
                    [key]: [...existing, {
                        from,
                        to,
                        content,
                        timestamp: new Date(),
                        isMine: from === myId
                    }]
                }
            };
        }),

    getMessagesForPeer: (peerId) => {
        const state = get();
        const myId = state.currentDevice?.id;
        if (!myId || !peerId) return [];
        const key = [myId, peerId].sort().join('-');
        return state.messages[key] || [];
    },

    setMessages: (deviceId, messages) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [deviceId]: messages
            }
        })),

    addTrustedDevice: (deviceId) =>
        set((state) => ({
            trustedDevices: [...new Set([...state.trustedDevices, deviceId])]
        })),

    removeTrustedDevice: (deviceId) =>
        set((state) => ({
            trustedDevices: state.trustedDevices.filter(id => id !== deviceId)
        }))
}));
