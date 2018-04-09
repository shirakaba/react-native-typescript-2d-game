import React, {Component, PureComponent} from 'react';
import {Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {StyleObject} from "../utils/utils";

interface Props {
    // visible: boolean
}

interface State {
}

export class Aligner extends Component<Props, State> {
    constructor(props: Props){
        super(props);
    }

    render() {
        return (
            <View style={[styles.container]}/>
        );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    }
});
