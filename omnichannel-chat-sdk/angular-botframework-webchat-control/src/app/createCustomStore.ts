class CustomStore {
    private static _instance: CustomStore;
    private middlewares: any;

    private constructor() {
        this.middlewares = {};
    }

    public static getInstance(): CustomStore {
        if (!this._instance) {
            this._instance = new CustomStore();
        }
        return this._instance;
    }

    // Add new middlewares
    public subscribe(name: string, middleware: any): void {
        this.middlewares[name] = middleware;
    }

    public create() {
        console.log(`[CustomStore][create]`);
        const createStore = (window as any).WebChat.createStore;
        return createStore(
            {}, // initial state
            ({ dispatch }: any) => (next: any) => (action: any) => {
                // console.log(`[Store] ${action.type}`);
                let nextAction = action;
                if (action && action.payload) {
                    for (const name of Object.keys(this.middlewares)) {
                        const currentMiddleware = this.middlewares[name];
                        // Apply middleware if applicable
                        if (currentMiddleware.applicable(nextAction)) {
                            const result = currentMiddleware.apply(nextAction);
                            if (result.dispatchAction) {
                                dispatch(result.dispatchAction);
                            }
                            if (result.nextAction) {
                                nextAction = result.nextAction;
                            }
                        }
                    }
                }
                return next(nextAction);
            }
        );
    }
}

const createCustomStore = () => {
    console.log(`[createCustomStore]`);
    const store = CustomStore.getInstance();
    return store;
};

export default createCustomStore;
