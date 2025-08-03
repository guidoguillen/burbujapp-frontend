// Store básico para manejo de estado global
interface StoreState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  user: null,
  loading: false,
  error: null,
};

// Simple store implementation
class Store {
  private state: StoreState = initialState;
  private listeners: ((state: StoreState) => void)[] = [];

  getState(): StoreState {
    return this.state;
  }

  setState(newState: Partial<StoreState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  subscribe(listener: (state: StoreState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const store = new Store();

// Actions
export const storeActions = {
  setUser: (user: any) => {
    store.setState({ user });
  },
  
  setLoading: (loading: boolean) => {
    store.setState({ loading });
  },
  
  setError: (error: string | null) => {
    store.setState({ error });
  },
  
  clearStore: () => {
    store.setState(initialState);
  },
};
