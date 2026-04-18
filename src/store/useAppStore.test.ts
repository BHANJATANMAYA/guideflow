import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset state before each test
    const store = useAppStore.getState();
    store.setActiveTab('dashboard');
    store.setEvent(null);
    store.setZones([]);
  });

  it('should initialize with default values', () => {
    const state = useAppStore.getState();
    expect(state.activeTab).toBe('dashboard');
    expect(state.isVIPModalOpen).toBe(false);
    expect(state.loading).toBe(true);
    expect(state.zones).toEqual([]);
  });

  it('should update active tab', () => {
    useAppStore.getState().setActiveTab('map');
    expect(useAppStore.getState().activeTab).toBe('map');
  });

  it('should toggle modals correctly', () => {
    const { toggleModal } = useAppStore.getState();
    toggleModal('vip');
    expect(useAppStore.getState().isVIPModalOpen).toBe(true);
    toggleModal('vip');
    expect(useAppStore.getState().isVIPModalOpen).toBe(false);
  });
});
