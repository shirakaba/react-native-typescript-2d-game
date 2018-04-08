import React, {Component, PureComponent} from 'react';
import {Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {StyleObject} from "../utils/utils";

interface Props {
    modalVisible: boolean
}

interface State {
    modalVisible: boolean
}

export class GameOverModal extends PureComponent<Props, State> {
    constructor(props: Props){
        super(props);

        this.state = {
            modalVisible: this.props.modalVisible,
        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
        return (
            <Modal
                // presentationStyle="formSheet"
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                }}>
                <View style={styles.modalContent}>
                    <View>
                        <Text>Hello World!</Text>

                        <TouchableOpacity
                            onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}>
                            <View style={styles.button}>
                                <Text>Hide modal</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalContent: {
        position: "absolute",
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    }
});
