import React, {Component, PureComponent} from 'react';
import {AsyncStorage, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {hasArrivedAtCoord, milliseconds, StyleObject} from "../utils/utils";

interface Props {
    modalVisible: boolean,
    timeSurvived: milliseconds,
    resetGame: () => void
}

interface State {
    modalVisible: boolean,
    timeSurvived: milliseconds,
    storedHighScore: milliseconds|null
}

export const HIGH_SCORE_KEY: string = "highscore";

export class GameOverModal extends Component<Props, State> {
    constructor(props: Props){
        super(props);
        console.log(`GameOverModal constructed.`);

        this.state = {
            modalVisible: this.props.modalVisible,
            timeSurvived: 0,
            storedHighScore: null
        };
    }

    componentDidMount(): void {
        console.log(`GameOverModal did mount.`);
        // this.setNewHighScore(0).catch((e: any) => console.error(e));
        this.assessHighScore().catch((e: any) => console.error(e));
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if(this.state.modalVisible){
            return
        } else {
            if(nextProps.modalVisible !== this.state.modalVisible){
                this.assessHighScore(nextProps.timeSurvived).catch((e: any) => console.error(e));
                this.setState({
                    modalVisible: nextProps.modalVisible,
                    timeSurvived: nextProps.timeSurvived
                });
            }
        }
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if(nextProps.modalVisible !== this.state.modalVisible) return true;
        if(nextState.modalVisible !== this.state.modalVisible) return true;
        return false;
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    private assessHighScore(timeSurvived?: number): Promise<string> {
        console.log(`Assessing high score...`);

        return AsyncStorage.getItem(
            HIGH_SCORE_KEY,
            (error?: Error, result?: string) => {
                if(error){
                    console.error(error);
                } else {
                    console.log(`Got the stored high score: ${result}`);
                    if(result){
                        const storedHighScore: number = parseInt(result);
                        this.setState({ storedHighScore });

                        if(timeSurvived){
                            // If difference is greater than 100 ms
                            // if(timeSurvived > storedHighScore){
                            if(timeSurvived - storedHighScore > 100){
                                console.log(`(timeSurvived ${timeSurvived} > storedHighScore ${storedHighScore}) to 1 dp, so setting new high score!`);
                                this.setNewHighScore(timeSurvived).catch((e: any) => console.error(e));
                            } else {
                                console.log(`(timeSurvived ${timeSurvived} <= storedHighScore ${storedHighScore}) to 1 dp, so not setting new high score.`);
                            }
                        }
                    } else {
                        console.log(`Result was falsy, so maybe hasn't been set yet.`);
                        if(timeSurvived) this.setNewHighScore(timeSurvived).catch((e: any) => console.error(e));
                    }
                }
            }
        );
    }



    private setNewHighScore(timeSurvived: milliseconds): Promise<void> {
        // console.log(`About to set ${(timeSurvived / 1000).toFixed(1)} as new high score...`);
        console.log(`About to set ${timeSurvived} as new high score...`);

        return AsyncStorage.setItem(
            HIGH_SCORE_KEY,
            // (timeSurvived / 1000).toFixed(1),
            timeSurvived.toString(),
            (error?: Error) => {
                if(error){
                    console.error(error);
                } else {
                    console.log(`Stored ${timeSurvived} as new high score.`);
                    // this.setState({ storedHighScore: timeSurvived });
                }
            }
        );
    }

    render() {
        return (
            <Modal
                // animationIn="slideInUp"
                // animationIn="zoomInDown"
                // animationIn="swing"
                animationIn="shake"
                isVisible={this.state.modalVisible}
                onModalHide={() => {
                    // console.log("ON MODAL HIDE");
                    this.props.resetGame();
                }}
                onModalShow={() => {}}
                // supportedOrientations={['portrait', 'landscape']}
                >
                <View style={styles.modalContent}>
                    <View>
                        <Text style={{ fontSize: 32, textAlign: "center" }}>Game over!</Text>
                        <Text style={{ textAlign: "center" }}>
                            {`You lasted: ${(this.state.timeSurvived / 1000).toFixed(1)} seconds.`}
                        </Text>
                        {
                            this.state.storedHighScore !== null && (this.state.timeSurvived - this.state.storedHighScore > 100) ?
                                (
                                    <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                                        {
                                            /* Emoji identified as Party Popper (:tada:) from:
                                             *   https://emojipedia.org/party-popper/
                                             * UTF-16 input code from:
                                             *   https://github.com/omnidan/node-emoji/blob/master/lib/emojifile.js
                                             *   https://www.fileformat.info/info/unicode/char/1f389/index.htm
                                             **/
                                            `NEW RECORD! \uD83C\uDF89`
                                        }
                                    </Text>
                                ) :
                                (null)
                        }
                        {
                            this.state.storedHighScore === null ?
                                (null) :
                                (
                                    <Text style={{ textAlign: "center" }}>
                                        {`Last high-score was: ${(this.state.storedHighScore / 1000).toFixed(1)} seconds.`}
                                    </Text>
                                )
                        }

                        <TouchableOpacity
                            onPress={() => {
                                this.setModalVisible(false);
                            }}
                        >
                            <View style={styles.button}>
                                <Text>Play again</Text>
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
        position: "relative",
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    }
});
