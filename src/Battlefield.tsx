// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React, {Component} from 'react';
import {GestureResponderEvent, StyleSheet, Text, View} from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import {Box, BoxTransforms} from "./Box";
import {ComponentStyle, isColliding, Location, StyleObject} from "./utils";
import PropTypes from 'prop-types';

interface Props {
}

type BattlefieldState = BoxStates & CollisionState & TimeState;

interface CollisionState {
    colliding: boolean
}

interface BoxStates {
    redBoxTransform: BoxTransforms,
    // red box will ALWAYS target blue's latest position.
    redBoxSize: number,
    blueBoxTransform: BoxTransforms,
    blueBoxTargetLocation: Location
}

interface TimeState {
    lastFrameDate: number;
    currentFrameDate: number;
}

export class Battlefield extends Component<Props, BattlefieldState> {
    private frameNo: number = 0;
    private blueBoxSize: number = 25;
    private redBoxSizeLimit: number = 200;
    private batchedState: Partial<BattlefieldState> = {};
    private scaleInterval: number;

    static contextTypes = {
        loop: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);
        const blueInitialLeft: number = 200;
        const blueInitialTop: number = 400;
        const date: number = Date.now();

        this.state = {
            lastFrameDate: date,
            currentFrameDate: date,
            colliding: false,
            redBoxTransform: {
                left: 90,
                top: 75,
                rotation: 0
            },
            redBoxSize: 50,
            blueBoxTransform: {
                left: blueInitialLeft,
                top: blueInitialTop,
                rotation: 0
            },
            blueBoxTargetLocation: {
                left: blueInitialLeft,
                top: blueInitialTop
            }
        };

        this.update = this.update.bind(this);
        this.beginTimedEvents();
    }

    private beginTimedEvents(): void {
        this.scaleInterval = setInterval(() => {
            if(this.state.redBoxSize === this.redBoxSizeLimit) clearInterval(this.scaleInterval);
            this.batchState({
                redBoxSize: this.state.redBoxSize + 1
            });
        }, 200);
    }

    /**
     * Instead of setting the Battlefield state any time state is lifted up to it or it has its own state to change, we
     * prepare batches of state to be set only upon each frame update. This is hugely beneficial for performance.
     * You can see for yourself by replacing all usages of batchState() with direct setState() calls!
     * @param {Partial<BattlefieldState>} state
     */
    private batchState(state: Partial<BattlefieldState>): void {
        Object.assign(this.batchedState, state);
    }

    /**
     * Called each frame of the game loop.
     * Assesses the final state of the Battlefield each frame, based on the batches of state it has received by the time
     * it has been called, then ultimately sets the state, prompting a render. Finally resets the batchedState.
     */
    private update(): void {
        this.frameNo++;

        this.batchedState.lastFrameDate = this.state.currentFrameDate;
        this.batchedState.currentFrameDate = Date.now();

        if(this.batchedState.redBoxTransform || this.batchedState.blueBoxTransform){
            /* The batchedState is not guaranteed to have all fields populated each update, so we default to the latest
             * known Battlefield state in each case. */
            this.batchState({
                colliding: isColliding(
                    this.batchedState.redBoxTransform || this.state.redBoxTransform,
                    this.batchedState.redBoxSize || this.state.redBoxSize,
                    this.batchedState.blueBoxTransform || this.state.blueBoxTransform,
                    this.blueBoxSize
                )
            });
        }

        this.setState(this.batchedState as BattlefieldState);
        this.batchedState = {};
    };

    componentDidMount(): void {
        this.context.loop.subscribe(this.update); // See react-game-kit for (limited) documentation. Not a Promise.
    }

    componentWillUnmount(): void {
        this.context.loop.unsubscribe(this.update); // See react-game-kit for (limited) documentation. Not a Promise.
        clearInterval(this.scaleInterval);
    }

    onResponderGrant(ev: GestureResponderEvent): void {
        this.updateBlueBoxTarget(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
    }

    // Fired less frequently than screen update, at least for iOS simulator.
    onResponderMove(ev: GestureResponderEvent): void {
        this.updateBlueBoxTarget(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
    }

    onPositionUpdate(id: string, left: number, top: number, rotation: number): void {
        switch(id){
            case "red":
                this.batchState({
                    redBoxTransform: {
                        left,
                        top,
                        rotation
                    }
                });
                break;
            case "blue":
                this.batchState({
                    blueBoxTransform: {
                        left,
                        top,
                        rotation
                    }
                });
                break;
            default:
                break;
        }
    }

    /**
     * The blue box will advance towards this target location once per frame at a rate based on its 'speed' prop.
     * The distance of advance each frame is dependent on time elapsed, and so will compensate if frames are dropped.
     */
    updateBlueBoxTarget(left: number, top: number): void {
        this.batchState({
            blueBoxTargetLocation: {
                left: left - this.blueBoxSize/2,
                top: top - this.blueBoxSize/2
            }
        });
    }

    render() {
        const framerate: number = 60; // TODO: get proper number from device info.
        const dynamicCollisionIndicatorStyle: Partial<ComponentStyle> = {
            color: this.state.colliding ? "red" : "green"
        };

        return (
            <Loop>
                <View
                    style={styles.container}
                    onStartShouldSetResponder={(ev: GestureResponderEvent) => true}
                    onResponderGrant={this.onResponderGrant.bind(this)}
                    onResponderMove={this.onResponderMove.bind(this)}
                >
                    <Text style={[styles.collisionIndicator, dynamicCollisionIndicatorStyle]}>{this.state.colliding ? "COLLIDING!" : "SAFE!"}</Text>
                    <Box
                        id={"red"}
                        currentFrameDate={this.state.currentFrameDate}
                        lastFrameDate={this.state.lastFrameDate}
                        speed={5 / (1000 / framerate)}
                        size={this.state.redBoxSize}
                        colour={"red"}
                        targetLeft={this.state.blueBoxTransform.left + this.blueBoxSize/2 - this.state.redBoxSize/2}
                        targetTop={this.state.blueBoxTransform.top + this.blueBoxSize/2 - this.state.redBoxSize/2}
                        onPositionUpdate={this.onPositionUpdate.bind(this)}
                    />
                    <Box
                        id={"blue"}
                        currentFrameDate={this.state.currentFrameDate}
                        lastFrameDate={this.state.lastFrameDate}
                        speed={10 / (1000 / framerate)}
                        size={this.blueBoxSize}
                        colour={"blue"}
                        targetLeft={this.state.blueBoxTargetLocation.left}
                        targetTop={this.state.blueBoxTargetLocation.top}
                        onPositionUpdate={this.onPositionUpdate.bind(this)}
                    />
            </View>
        </Loop>
    );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    container: {
        position: 'absolute',
        height: "100%",
        width: "100%",
        backgroundColor: 'orange',
    },
    collisionIndicator: {
        position: 'absolute',
        left: 50,
        top: 50,
        fontSize: 20,
        fontWeight: 'bold',
        // borderColor: "black",
        // borderStyle: "dashed",
        // borderWidth: 1,
        backgroundColor: "rgba(255, 255, 0, 1)"
    }
});
