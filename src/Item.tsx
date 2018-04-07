// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React, { Component } from 'react';
import {
    StyleSheet, Image, ImageRequireSource
} from 'react-native';
import {Constants, Audio, PlaybackStatus, RequireSource} from 'expo';
import {ComponentStyle, StyleObject } from "./utils";

export enum ItemType {
    Speed,
    Shrink,
    Teleport,
    Mine,
}

export interface ItemProps {
    // id: number,
    type: ItemType,
    left: number,
    top: number,
    consumed: boolean
}

interface State {
    // consumed: boolean
}

// TODO: Figure out how to rewrite as class static.
export const itemLength: number = 20;
// export const SPEED_SOUND: RequireSource = require("../assets/sounds/swing1.mp3");
// export const SHRINK_SOUND: RequireSource = require("../assets/sounds/swing3.mp3");
// export const TELEPORT_SOUND: RequireSource = require("../assets/sounds/attack2.mp3");
// export const MINE_SOUND: RequireSource = require("../assets/sounds/explosion1.mp3");

export class Item extends Component<ItemProps, State> {
    // TODO: Find out why static values don't work in a React component. May be due to PropTypes.
    // private static size: number = 10;
    private readonly colour: string;
    private readonly img: ImageRequireSource;
    private readonly sound: RequireSource;

    constructor(props: ItemProps) {
        super(props);

        this.colour = Item.mapItemTypeToColour(props.type);
        this.img = Item.mapItemTypeToImage(props.type);
        this.sound = Item.mapItemTypeToSound(props.type);

        this.state = {
            consumed: false
        };
    }

    componentDidMount(): void {
    }

    componentWillUnmount(): void {
    }

    /** Very likely that my naive implementation has room for improvement here. Open to comments. */
    shouldComponentUpdate(nextProps: Readonly<ItemProps>, nextState: Readonly<State>, nextContext: any): boolean {
        // Visual props
        // if(nextProps === this.props) return false;
        // Items will never change type during their lifecycle.
        if(this.props.left !== nextProps.left) return true;
        if(this.props.top !== nextProps.top) return true;
        if(this.props.consumed !== nextProps.consumed) return true;

        // Visual state
        // if(this.state.consumed !== nextState.consumed) return true;

        return false;
    }

    static mapItemTypeToImage(type: ItemType): ImageRequireSource {
        switch(type){
            case ItemType.Speed:
                return require("../assets/items/speed.png");
            case ItemType.Shrink:
                return require("../assets/items/shrink.png");
            case ItemType.Teleport:
                // TODO: animate
                return require("../assets/items/teleport.png");
            case ItemType.Mine:
                return require("../assets/items/mine.png");
            default:
                return require("../assets/items/speed.png");
        }
    }

    static mapItemTypeToColour(type: ItemType): string {
        switch(type){
            case ItemType.Speed:
                return "yellow";
            case ItemType.Shrink:
                return "white";
            case ItemType.Teleport:
                return "cyan";
            case ItemType.Mine:
                return "gray";
            default:
                return "black";
        }
    }

    static mapItemTypeToSound(type: ItemType): RequireSource {
        switch(type){
            case ItemType.Speed:
                // By Taira Komori, of: http://taira-komori.jpn.org/freesounden.html
                // Found at: http://taira-komori.jpn.org/sound_os/attack01/swing1.mp3
                // And also initially at: https://freesound.org/people/Taira%20Komori/sounds/215025/
                // Licence on freesound: https://creativecommons.org/licenses/by/3.0/ (Attribution 3.0 Unported (CC BY 3.0))
                // Attribution on Taira Komori's own website: "Please consider giving me a credit or linking back to me"
                // Terms of Use: "free of charge and royalty free in your projects... be it for commercial or non-commercial purposes"
                return require("../assets/sounds/swing1.mp3");
            case ItemType.Shrink:
                // Taira Komori again:
                // http://taira-komori.jpn.org/attack01en.html
                // http://taira-komori.jpn.org/sound_os/attack01/swing3.mp3
                return require("../assets/sounds/swing3.mp3");
            case ItemType.Teleport:
                // Taira Komori again:
                // http://taira-komori.jpn.org/attack01en.html
                // http://taira-komori.jpn.org/sound_os/attack01/attack2.mp3
                return require("../assets/sounds/attack2.mp3");
            case ItemType.Mine:
                // Taira Komori again:
                // http://taira-komori.jpn.org/attack01en.html
                // Any of these would be suitable:
                // http://taira-komori.jpn.org/sound_os/attack01/attack1.mp3
                // http://taira-komori.jpn.org/sound_os/arms01/bomb.mp3
                // http://taira-komori.jpn.org/sound_os/arms01/explosion1.mp3
                return require("../assets/sounds/explosion1.mp3");
            default:
                return require("../assets/sounds/swing1.mp3");
        }
    }

    static playSound(type: ItemType): Promise<PlaybackStatus> {
        const soundObject: Audio.Sound = new Audio.Sound();

        return soundObject
        .loadAsync(Item.mapItemTypeToSound(type))
        .then((ps: PlaybackStatus) => soundObject.playAsync());
    }

    /**
     * As an easy proof-of-concept, each Item is rendered as a View component, but it is likely much more efficient to
     * render them with Canvas or some other dedicated graphics feature to reduce their overhead!
     */
    render() {
        const dynamicStyle: Partial<ComponentStyle> = {
            // backgroundColor: this.colour,
            width: itemLength,
            height: itemLength,
            transform: [
                { translateX: this.props.left },
                { translateY: this.props.top }
            ],
            display: this.props.consumed ? "none" : "flex"
        };

        return (
            <Image
                source={this.img}
                style={[styles.static, dynamicStyle]}
            />
        );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    static: {
        // borderColor: "black",
        // borderStyle: "solid",
        // borderWidth: 1,
        position: "absolute",
    }
});
