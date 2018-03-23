import React, {Component} from 'react';
import {GestureResponderEvent, StyleSheet, Text, View} from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import {Box, BoxTransforms} from "./Box";
import {Direction, isColliding, Location} from "./utils";
import PropTypes from 'prop-types';

interface Props {
}

type BattlefieldState = BoxPositionStates & CollisionState;

interface CollisionState {
    colliding: boolean
}

interface BoxPositionStates {
    redBoxTransform: BoxTransforms,
    // red box will ALWAYS target blue's latest position.
    redBoxSize: number,
    blueBoxTransform: BoxTransforms,
    blueBoxTargetLocation: Location
}

export class Battlefield extends Component<Props, BattlefieldState> {
    private frameNo: number = 0;
    private blueBoxSize: number = 25;
    private batchedState: Partial<BattlefieldState> = {};
    private scaleInterval: number;

    static contextTypes = {
        loop: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);
        const redInitialLeft: number = 90;
        const redInitialTop: number = 75;
        const blueInitialLeft: number = 200;
        const blueInitialTop: number = 400;

        this.state = {
            colliding: false,
            redBoxTransform: {
                left: redInitialLeft,
                top: redInitialTop,
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
            if(this.state.redBoxSize === 200) clearInterval(this.scaleInterval);
            this.batchState({
                redBoxSize: this.state.redBoxSize + 1
            });
        }, 200);
    }

    private batchState(state: Partial<BattlefieldState>): void {
        Object.assign(this.batchedState, state);
    }

    private update(): void {
        this.frameNo++;

        if(this.batchedState.redBoxTransform || this.batchedState.blueBoxTransform){
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
        this.context.loop.subscribe(this.update);
    }

    componentWillUnmount(): void {
        this.context.loop.unsubscribe(this.update);
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

    updateBlueBoxTarget(left: number, top: number): void {
        this.batchState({
            blueBoxTargetLocation: {
                left: left - this.blueBoxSize/2,
                top: top - this.blueBoxSize/2
            }
        });
    }

    render() {
        const framerate: number = 60;
        return (
            <Loop>
                <View
                    style={styles.container}
                    onStartShouldSetResponder={(ev: GestureResponderEvent) => true}
                    onResponderGrant={this.onResponderGrant.bind(this)}
                    onResponderMove={this.onResponderMove.bind(this)}
                >
                    <Text style={styles.textbox}>{this.state.colliding ? "COLLIDING!" : "SAFE!"}</Text>
                    <Box
                        id={"red"}
                        speed={5 / (1000 / framerate)}
                        size={this.state.redBoxSize}
                        colour={"red"}
                        targetLeft={this.state.blueBoxTransform.left + this.blueBoxSize/2 - this.state.redBoxSize/2}
                        targetTop={this.state.blueBoxTransform.top + this.blueBoxSize/2 - this.state.redBoxSize/2}
                        onPositionUpdate={this.onPositionUpdate.bind(this)}
                    />
                    <Box
                        id={"blue"}
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

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: "100%",
        width: "100%",
        backgroundColor: 'orange',
    },
    textbox: {
        position: 'absolute',
        left: 50,
        top: 50,
        fontSize: 20,
        fontWeight: 'bold'
    }
});
