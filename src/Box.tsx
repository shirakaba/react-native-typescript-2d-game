import React, { Component } from 'react';
import {
    View, StyleSheet, Text, ViewStyle, TextStyle, ImageStyle, RegisteredStyle,
    GestureResponderEvent
} from 'react-native';
import PropTypes from 'prop-types';

interface Props {
    id: string,
    speed: number,
    size: number,
    colour: string,
    targetLeft: number,
    targetTop: number,
    onPositionUpdate: (id: string, left: number, top: number, rotation: number) => void
    // onTouchEvent: (targetLeft: number, targetTop: number) => void
    // count: number,
    // increment: () => any,
    // decrement: () => any
}

interface State {
    speed: number,
    size: number,
    rotation: number,
    hasDefinitelyArrived: boolean,
    left: number,
    top: number
    // targetLeft: number,
    // targetTop: number
}

export const radToDeg: number = 180/Math.PI;

export class Box extends Component<Props, State> {
    private date: number = Date.now();
    // static propTypes = {
    //     radToDeg: 180/Math.PI // must be a function
    //     // keys: PropTypes.object,
    //     // onEnterBuilding: PropTypes.func,
    //     // store: PropTypes.object,
    // };

    static contextTypes = {
        loop: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);
        // console.log("RECONSTRUCTED");

        this.state = {
            speed: this.props.speed,
            size: this.props.size,
            rotation: 0,
            hasDefinitelyArrived: true,
            left: this.props.targetLeft,
            top: this.props.targetTop
        };

        this.advance = this.advance.bind(this);
        this.hasArrivedAtCoord = this.hasArrivedAtCoord.bind(this);
        this.hasArrived = this.hasArrived.bind(this);
        this.update = this.update.bind(this); // ABSOLUTELY necessary - update() is getting called from somewhere invisible.
    }

    hasArrivedAtCoord(target: number, current: number): boolean {
        return Math.abs(target - current) < 0.00001;
    }

    hasArrived(): boolean {
        return this.hasArrivedAtCoord(this.props.targetLeft, this.state.left) && this.hasArrivedAtCoord(this.props.targetTop, this.state.top);
    }

    componentWillReceiveProps(nextProps: Props): void {
        this.setState({
            hasDefinitelyArrived: this.hasArrivedAtCoord(nextProps.targetTop, this.state.top) && this.hasArrivedAtCoord(nextProps.targetLeft, this.state.left)
        });
    }

    // componentWillUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): void {
    // }

    // instead of loop()
    update() {
        // this.date = Date.now();
        if(this.state.hasDefinitelyArrived){
            this.date = Date.now();
            return;
        } else {
            this.advance(Date.now());
        }
        // console.log("this.state", this.state);
        // console.log("BOX UPDATE");
        // if(!this.hasArrived()){
        // }
    };

    componentDidMount(): void {
        this.context.loop.subscribe(this.update); // Not actually a promise!
        // if(this.props.colour !== "red") {
        // }
    }

    componentWillUnmount(): void {
        this.context.loop.unsubscribe(this.update); // Not actually a promise!
    }

    advance(date: number): void {
        const dateDiff: number = date - this.date;
        this.date = date;

        // if(this.hasArrived()) return;

        // console.log(`[advance()] targetLeft: ${this.props.targetLeft.toFixed(1)}; targetTop: ${this.props.targetTop.toFixed(1)}; left: ${this.state.left.toFixed(1)}; top: ${this.state.top.toFixed(1)}`);
        const xDiff: number = this.props.targetLeft - this.state.left;
        const yDiff: number = this.props.targetTop - this.state.top;

        const angle: number = Math.atan2(yDiff, xDiff);
        const maxAdvanceX: number = Math.cos(angle) * (this.state.speed * dateDiff);
        const maxAdvanceY: number = Math.sin(angle) * (this.state.speed * dateDiff);
        // console.log(`[advance()] angle: ${(angle * (180/3.14159)).toFixed(2)}º; maxAdvanceY: ${maxAdvanceX.toFixed(0)}; maxAdvanceX ${maxAdvanceX.toFixed(0)}`);

        this.setState((prevState: Readonly<State>, props: Props) => {
            const left: number = (xDiff >= 0 ? Math.min(prevState.left + maxAdvanceX, props.targetLeft) : Math.max(prevState.left + maxAdvanceX, props.targetLeft));
            const top: number = (yDiff >= 0 ? Math.min(prevState.top + maxAdvanceY, props.targetTop) : Math.max(prevState.top + maxAdvanceY, props.targetTop));
            const extraRotation: number = (angle * radToDeg - prevState.rotation) % 360; // Easing!
            const easing: number = 4;
            // if(this.props.id === "red"){
            //     if(extraRotation < -270){
            //         console.log(`extraRotation below -270°: ${extraRotation}`)
            //     } else if(extraRotation < -180){
            //         console.log(`extraRotation below -180°: ${extraRotation}`)
            //     } else if(extraRotation < -90){
            //         console.log(`extraRotation below -90°: ${extraRotation}`)
            //     } else if(extraRotation < -45){
            //         console.log(`extraRotation below -45°: ${extraRotation}`)
            //     } else if(extraRotation < -30){
            //         console.log(`extraRotation below -30°: ${extraRotation}`)
            //     } else if(extraRotation < 0){
            //         console.log(`extraRotation below 0°: ${extraRotation}`)
            //     } else if(extraRotation >= 30){
            //         console.log(`extraRotation exceeded 30°: ${extraRotation}`)
            //     } else if(extraRotation >= 45){
            //         console.log(`extraRotation exceeded 45°: ${extraRotation}`)
            //     } else if(extraRotation >= 90){
            //         console.log(`extraRotation exceeded 90°: ${extraRotation}`)
            //     } else if(extraRotation >= 180){
            //         console.log(`extraRotation exceeded 180°: ${extraRotation}`)
            //     } else if(extraRotation >= 270){
            //         console.log(`extraRotation exceeded 270°: ${extraRotation}`)
            //     } else if(extraRotation >= 360) {
            //         console.log(`extraRotation exceeded 360°: ${extraRotation}`)
            //     }
            // }
            // If easedRotation is -86,
            // If extraRotation is -30, then it's okay to add -30.
            // If extraRotation is -181, then it's better to add 179.
            // extraRotation < -181
            // 360 + -181 = + 179
            const compensatedRotation: number = (extraRotation) <= -180 ? (360 + extraRotation) : extraRotation;
            const compensatedEasedRotation: number = compensatedRotation/easing;

            // const newRotation: number = prevState.rotation + extraRotation/easing;
            const newRotation: number = prevState.rotation + compensatedEasedRotation;

            // Unclear whether this should be before setState() call (now) or after (during componentWillUpdate() call).
            this.props.onPositionUpdate(this.props.id, left, top, newRotation);

            return {
                rotation: newRotation,
                left: left,
                top: top,
                hasDefinitelyArrived: this.hasArrivedAtCoord(props.targetLeft, left) && this.hasArrivedAtCoord(props.targetTop, top)
            }
        });
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if(this.state.top === nextState.top && this.state.left === nextState.left){
            // if(this.state !== nextState) console.log("top & left same, but no shallow equals.");
            if(this.props === nextProps){
                // console.log("top and left of current/next states equal, as well as props!");
                return false;
            } else {
                // console.log("top and left of current/next states equal, yet props differed");
                return false;
            }
        } else {
            // console.log("top and left of current/next states differ");
        }
        return true;
    }

    render() {
        const combinedStyles: Partial<ComponentStyle> = {
            backgroundColor: this.props.colour,
            // left: this.props.targetLeft,
            // top: this.props.targetTop,
            // left: this.state.left,
            // top: this.state.top,
            width: this.state.size,
            height: this.state.size,
            transform: [
                { translateX: this.state.left },
                { translateY: this.state.top },
                { rotate: `${this.state.rotation}deg` }
            ]
        };

        return (
            <View
                // onStartShouldSetResponder={(ev: GestureResponderEvent) => false}
                // onMoveShouldSetResponder={(ev: GestureResponderEvent) => false}
                style={[styles.boxItself, combinedStyles]}
            />
        );
    }
}

export type ComponentStyle = ViewStyle|ImageStyle|TextStyle;
export interface StyleObject {
    [key: string]: Partial<ComponentStyle>;
}
export interface BoxStyleObject extends StyleObject {
    boxItself: Partial<ViewStyle>;
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    boxItself: {
        // backgroundColor: "red",
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        position: "absolute"
    }
});
