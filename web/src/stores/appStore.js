import { create } from 'zustand';

export const useAppStore = create((set) => ({
    connectionStatus: 'disconnected', // connecting, connected, disconnected
    currentDevice: null,
    connectedDevices: [],
    selectedPeer: null,
    messages: {}, // { deviceId: [...messages] }
    trustedDevices: [],

    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setCurrentDevice: (device) => set({ currentDevice: device }),
    setConnectedDevices: (devices) => set({ connectedDevices: devices }),
    setSelectedPeer: (deviceId) => set({ selectedPeer: deviceId }),

    addMessage: (from, to, content) =>
        set((state) => {
            const key = [from, to].sort().join('-');
            const existing = state.messages[key] || [];
            return {
                messages: {
                    ...state.messages,
                    [key]: [...existing, { from, to, content, timestamp: new Date() }]
                }
            };
        }),

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
