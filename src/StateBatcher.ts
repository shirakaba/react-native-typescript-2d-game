type BatchedStateComparativeCallback<Props, State> = (prevState: Readonly<State>, props: Props) => Partial<State>;

/**
 * This class allows a batch of state to be prepared during a frame in order to be set
 */
export class StateBatcher<Props, State> {
    public batchedState: Partial<State> = {};
    private batchedStateComparativeCallbacks: BatchedStateComparativeCallback<Props, State>[] = [];
    private batchedStateCompletionCallbacks: (()=>void)[] = [];

    constructor(
        private readonly setState: <Key extends keyof State>(
            // this: Component<Props, State>,
            state: ((prevState: Readonly<State>, props: Props) => (Pick<State, Key> | State | null)) | (Pick<State, Key> | State | null),
            callback?: () => void
        ) => void
    ){

    }

    /**
     * Instead of setting the Battlefield state any time state is lifted up to it or it has its own state to change, we
     * prepare batches of state to be set only upon each frame update. This is hugely beneficial for performance.
     * You can see for yourself by replacing all usages of batchState() with direct setState() calls!
     * @param {Partial<BattlefieldState>} state
     * @param callback
     */
    public batchState(
        state: Partial<State> | BatchedStateComparativeCallback<Props, State>,
        callback?: () => void
    ): void {
        if(typeof state === "function"){
            this.batchedStateComparativeCallbacks.push(state);
        } else {
            Object.assign(this.batchedState, state);
        }

        if(callback) this.batchedStateCompletionCallbacks.push(callback);
    }

    private invokeBatchedStateComparativeCallbacks(
        batchedState: Partial<State>,
        batchedStateCompletionCallbacks: (()=>void)[],
        batchedStateComparativeCallbacks: BatchedStateComparativeCallback<Props, State>[]
    ): void {
        this.setState(
            (prevState: Readonly<State>, props: Props) => {
                return batchedStateComparativeCallbacks
                .reduce(
                    (acc: Partial<State>, batchCb: BatchedStateComparativeCallback<Props, State>, i: number, arr: BatchedStateComparativeCallback<Props, State>[]) => {
                        return Object.assign(acc, batchCb.call(this, Object.assign(prevState, acc), props));
                    },
                    batchedState as State
                );
            },
            this.passOptionalBatchedStateCompletionCallback(batchedStateCompletionCallbacks)
        );
    }

    private passOptionalBatchedStateCompletionCallback(batchedStateCompletionCallbacks: (()=>void)[]): undefined|(()=>void) {
        if(batchedStateCompletionCallbacks.length === 0) return undefined;
        return () => {
            batchedStateCompletionCallbacks.forEach((callback: () => void) => callback());
        };
    }

    public setStateBatch(): void {
        // We pass refs to each of these values as we'll read from them asynchronously and they will soon be blanked out.
        const batchedStateComparativeCallbacks = this.batchedStateComparativeCallbacks;
        const batchedState = this.batchedState;
        const batchedStateCompletionCallbacks = this.batchedStateCompletionCallbacks;

        if(batchedStateComparativeCallbacks.length > 0){
            this.invokeBatchedStateComparativeCallbacks(batchedState, batchedStateCompletionCallbacks, batchedStateComparativeCallbacks);
        } else {
            this.setState(
                batchedState as State,
                this.passOptionalBatchedStateCompletionCallback(batchedStateCompletionCallbacks)
            );
        }

        this.clearBatch();
    }

    private clearBatch(): void {
        this.batchedState = {};
        this.batchedStateCompletionCallbacks = [];
        this.batchedStateComparativeCallbacks = [];
    }
}