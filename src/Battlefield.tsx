import React, {Component} from 'react';
import {Alert, GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import {Box} from "./Box";
import PropTypes from 'prop-types';

interface Props {
}

type BattlefieldState = BoxPositionStates & CollisionState;

interface CollisionState {
    colliding: boolean
}

interface BoxPositionState extends BoxTargetState {
    rotation: number
}

interface BoxTargetState {
    left: number,
    top: number
}

interface BoxPositionStates {
    redBoxPosition: BoxPositionState,
    redBoxTarget: BoxTargetState,
    blueBoxPosition: BoxPositionState
    blueBoxTarget: BoxTargetState
}

export class Battlefield extends Component<Props, BattlefieldState> {
    private frameNo: number = 0;
    private blueBoxSize: number = 50;
    private redBoxSize: number = 200;
    private blueBoxHalfSize: number = this.blueBoxSize / 2;
    private redBoxHalfSize: number = this.redBoxSize / 2;
    // private blueBoxHalfSize: number = 0;
    // private redBoxHalfSize: number = 0;

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
            redBoxPosition: {
                left: redInitialLeft,
                top: redInitialTop,
                rotation: 0
            },
            redBoxTarget: {
                left: redInitialLeft,
                top: redInitialTop
            },
            blueBoxPosition: {
                left: blueInitialLeft,
                top: blueInitialTop,
                rotation: 0
            },
            blueBoxTarget: {
                left: blueInitialLeft,
                top: blueInitialTop
            }
        };

        this.update = this.update.bind(this);
    }

    // instead of loop()
    update() {
        this.frameNo++;
        // console.log(this.frameNo);
    };

    updateCollisionStatus(): void {
        if(this.isColliding(this.state.blueBoxPosition, this.state.redBoxPosition)){
            if(!this.state.colliding){
                this.setState({
                    colliding: true
                });
            }
        } else {
            if(this.state.colliding){
                this.setState({
                    colliding: false
                });
            }
        }
    }

    isColliding(blue: BoxPositionState, red: BoxPositionState): boolean {
        const blueRight: number = blue.left + this.blueBoxSize;
        const blueBottom: number = blue.top + this.blueBoxSize;
        const redRight: number = red.left + this.redBoxSize;
        const redBottom: number = red.top + this.redBoxSize;
        if(
            blueRight > red.left && blueRight < redRight || // blue's right edge is in bounds
            blue.left > red.left && blue.left < redRight // blue's left edge is in bounds
        ){
            if(
                blue.top > red.top && blue.top < redBottom || // blue's top edge is in bounds
                blueBottom < redBottom && blueBottom > red.top // blue's bottom edge is in bounds
            ){
                return true;
            }
        }
        return false;
    }

    componentDidMount(): void {
        this.context.loop.subscribe(this.update);
    }

    componentWillUnmount(): void {
        this.context.loop.unsubscribe(this.update);
    }

    onResponderGrant(ev: GestureResponderEvent): void {
        // console.log(`[onResponderGrant] x: ${ev.nativeEvent.locationX}, y: ${ev.nativeEvent.locationY}, target: ${ev.nativeEvent.target}`);
        this.moveBlueBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
        // this.moveRedBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
    }

    // Less frequent than screen update.
    onResponderMove(ev: GestureResponderEvent): void {
        // console.log(`[onResponderMove] x: ${ev.nativeEvent.locationX}, y: ${ev.nativeEvent.locationY}, target: ${ev.nativeEvent.target}`);
        // this.moveBlueBox(ev.nativeEvent.locationX, ev.nativeEvent.locationY);
        // console.log(`[onResponderMove] ${this.frameNo}`);
        // if(this.frameNo % 2 === 0)
            this.moveBlueBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
        // this.moveRedBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
    }

    // TODO: ideally queue the two setState calls, as we know both WILL be updating each frame.
    onPositionUpdate(id: string, left: number, top: number, rotation: number): void {
        switch(id){
            case "red":
                this.setState({
                    redBoxPosition: {
                        left,
                        top,
                        rotation
                    }
                });
                // By collision-checking inside onPositionUpdate(), we're still invoking it at the screen refresh rate
                // (the rate at which this.advance() is called), but at least only when there's a change in box position.
                // console.log(`[${this.frameNo}] RED`);
                this.updateCollisionStatus();
                break;
            case "blue":
                this.setState({
                    blueBoxPosition: {
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

    // shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<BattlefieldState>, nextContext: any): boolean {
    //     // console.log(`this.state.redBoxPosition is ${JSON.stringify(this.state.redBoxPosition, null,3)}\n nextState.redBoxPosition is ${JSON.stringify(nextState.redBoxPosition, null, 3)}`);
    //
    //     // Battlefield doesn't currently receive any props any time.
    //     // if(nextProps !== this.props){
    //     //     console.log(nextProps);
    //     // }
    //
    //     if(this.state === nextState){
    //         // Never comes up, in practice.
    //         // console.log("Same state (shallow).");
    //     } else {
    //         // console.log("State differed (shallow).");
    //         if(this.state.redBoxPosition === nextState.redBoxPosition){
    //             if(this.state.redBoxTarget === nextState.redBoxTarget){
    //                 // console.log("redBoxPosition same (shallow), as well as its target (shallow)");
    //                 // Can't return false here.
    //                 if(this.state.blueBoxPosition === nextState.blueBoxPosition){
    //                     // console.log("redBoxPosition same (shallow), as well as its target (shallow), and blueBoxPosition (shallow).");
    //                     // Can't return false here.
    //                     if(this.state.blueBoxTarget === nextState.blueBoxTarget){
    //                         // Doesn't happen in practice.
    //                         // console.log("redBoxPosition same (shallow), as well as its target (shallow), and blueBoxPosition (shallow) as well as its target (shallow).");
    //                     } else {
    //                         // console.log("redBoxPosition same (shallow), as well as its target (shallow), and blueBoxPosition (shallow) but not its target (shallow).");
    //                         // Can't return false here.
    //                     }
    //                 } else {
    //                     // console.log("redBoxPosition same (shallow), as well as its target (shallow), but not blueBoxPosition (shallow).");
    //                     // Can't return false here.
    //                     if(this.state.blueBoxTarget === nextState.blueBoxTarget){
    //                         console.log("redBoxPosition same (shallow), as well as its target (shallow), but not blueBoxPosition (shallow) but still its target (shallow).");
    //                         // Can't return false here.
    //                     } else {
    //                         // Doesn't happen in practice.
    //                         console.log("redBoxPosition same (shallow), as well as its target (shallow), but not blueBoxPosition (shallow) nor its target (shallow).");
    //                     }
    //                 }
    //             } else {
    //                 // Never comes up in practice.
    //                 // console.log("redBoxPosition same (shallow), but not its target");
    //             }
    //         } else {
    //             // console.log("redBoxPosition differed (shallow)");
    //
    //         }
    //     }
    //
    //     return true;
    // }

    // moveRedBox(left: number, top: number): void {
    //     this.setState({
    //         redBoxTarget: {
    //             left: left - this.redBoxHalfSize,
    //             top: top - this.redBoxHalfSize
    //             // left: this.state.blueBoxPosition.left,
    //             // top: this.state.blueBoxPosition.top
    //         }
    //     });
    // }

    moveBlueBox(left: number, top: number): void {
        this.setState({
            blueBoxTarget: {
                left: left - this.blueBoxHalfSize,
                top: top - this.blueBoxHalfSize
            }
        });
    }

    render() {
        return (
            <Loop>
                <View
                    style={styles.container}
                    onStartShouldSetResponder={(ev: GestureResponderEvent) => true}
                    // onMoveShouldSetResponder={(ev: GestureResponderEvent) => false}
                    onResponderGrant={this.onResponderGrant.bind(this)}
                    // onResponderGrant={(ev: GestureResponderEvent) => { console.log(`onResponderGrant():`, ev.nativeEvent); }}
                    // onResponderReject={(ev: GestureResponderEvent) => { console.log(`onResponderReject():`, ev.nativeEvent); }}
                    onResponderMove={this.onResponderMove.bind(this)}
                    // onResponderRelease={(ev: GestureResponderEvent) => { console.log(`onResponderRelease():`, ev.nativeEvent); }}
                    // onResponderTerminationRequest={(ev: GestureResponderEvent) => true}
                    // onResponderTerminate={(ev: GestureResponderEvent) => { console.log(`onResponderTerminate():`, ev.nativeEvent); }}
                >
                    <Text style={styles.textbox}>{this.state.colliding ? "COLLIDING!" : "SAFE!"}</Text>
                    <Box
                        id={"red"}
                        speed={5}
                        size={this.redBoxSize}
                        colour={"red"}
                        // targetLeft={this.state.redBoxTarget.left}
                        // targetTop={this.state.redBoxTarget.top}
                        targetLeft={this.state.blueBoxPosition.left + this.blueBoxHalfSize - this.redBoxHalfSize}
                        targetTop={this.state.blueBoxPosition.top + this.blueBoxHalfSize - this.redBoxHalfSize}
                        onPositionUpdate={this.onPositionUpdate.bind(this)}
                    />
                    <Box
                        id={"blue"}
                        speed={10}
                        size={this.blueBoxSize}
                        colour={"blue"}
                        targetLeft={this.state.blueBoxTarget.left}
                        targetTop={this.state.blueBoxTarget.top}
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
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    textbox: {
        position: 'absolute',
        left: 150,
        top: 50,
        fontSize: 20,
        fontWeight: 'bold'
    }
});
