type BatchedStateComparativeCallback<Props, State> = (prevState: Readonly<State>, props: Props) => Partial<State>;

/**
 * This class allows a batch of state to be assembled during a frame so that setState(), which prompts a re-render, need
 * only be called once per frame.
 * TODO: investigate object pools to further reduce heap load: https://www.html5rocks.com/en/tutorials/speed/static-mem-pools/
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
        console.log(`invokeBatchedStateComparativeCallbacks()`);
        this.setState(
            (prevState: Readonly<State>, props: Props) => {
                console.log("prevState:", prevState);
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
        console.log(`passOptionalBatchedStateCompletionCallback()`);
        if(batchedStateCompletionCallbacks.length === 0) return undefined;
        return () => {
            batchedStateCompletionCallbacks.forEach((callback: () => void) => callback());
        };
    }

    public setStateBatch(): void {
        console.log(`setStateBatch()`);
        if(this.batchedStateComparativeCallbacks.length > 0){
            this.invokeBatchedStateComparativeCallbacks(this.batchedState, this.batchedStateCompletionCallbacks, this.batchedStateComparativeCallbacks);
        } else {
            this.setState(
                this.batchedState as State,
                this.passOptionalBatchedStateCompletionCallback(this.batchedStateCompletionCallbacks)
            );
        }

        this.clearBatch();
    }

    public clearBatch(): void {
        /* Simple, but it's better to re-use the memory that's already been allocated. */
        // this.batchedState = {};
        // this.batchedStateCompletionCallbacks = [];
        // this.batchedStateComparativeCallbacks = [];

        /* DO NOT delete or re-allocate this.batchedState; we can just re-use it as-is (it is up-to-date with the last
         * set state, although it may only contain a subset of the whole state's keys), preventing un-necessary extra
         * garbage on the heap. TODO: assess whether the extra diffing required by setState() makes this not worth it. */
        // Object.keys(this.batchedState).forEach((key: string) => delete this.batchedState[key]);
        this.batchedStateCompletionCallbacks.splice(0, this.batchedStateCompletionCallbacks.length);
        this.batchedStateComparativeCallbacks.splice(0, this.batchedStateComparativeCallbacks.length);
    }
}