/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    ScrollView,
    View,
    Dimensions,
    FlatList,
    Alert,
} from 'react-native';

let width = Dimensions.get('window').width; //full width
let height = Dimensions.get('window').height; //full height

class App extends Component {

    constructor() {
        super();
        this.state = {
            response: "",
            nbMsg: 0,
            msgApi: 0,
            idConversation: "",
            conversation: [],
            loading: true
        }
    }

    componentWillMount() {
        fetch("https://directline.botframework.com/api/conversations", {
            method: 'POST',
            headers: {
                Authorization: 'Bearer aDgDHJDvtXQ.cwA.5iM.7dg1yBydyqmtqOSZbjdmgDm7XU_6uSnY5sguq6fc0W8',
            }})
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    idConversation: responseData.conversationId,
                    loading: false
                })
})
            .done();
    }

    _sendHumanAnswer = () => {
        fetch("https://directline.botframework.com/api/conversations/"+this.state.idConversation+"/messages", {
            method: 'POST',
            headers: {
                Authorization: 'Bearer aDgDHJDvtXQ.cwA.5iM.7dg1yBydyqmtqOSZbjdmgDm7XU_6uSnY5sguq6fc0W8',
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: this.state.response,
                user: 'Human',
            }),
        })
            .then(() => {
                this._getBotAnswer()
            })
            .done();
    }

    _getBotAnswer = () => {
        fetch("https://directline.botframework.com/api/conversations/"+this.state.idConversation+"/messages", {
            headers: {
                Authorization: 'Bearer aDgDHJDvtXQ.cwA.5iM.7dg1yBydyqmtqOSZbjdmgDm7XU_6uSnY5sguq6fc0W8',
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.messages.length === this.state.nbMsg)
                    this._getBotAnswer();
                else {
                    var msg = this.state.nbMsg;
                    while (msg < responseJson.messages.length) {
                        this._apprendBotAnswer(responseJson.messages[msg].text);
                        msg++;
                    }
                }
            })
            .done();
    }

    _apprendBotAnswer = (answer) => {
        this.setState({nbMsg: this.state.nbMsg+=1});
        var conversationPush = this.state.conversation.slice();
        conversationPush.push({key: this.state.nbMsg, msg: answer, from: "Bot"});
        this.setState({
            conversation: conversationPush,
        });
    }

    _appendHumanAnswer = () => {
        this.setState({nbMsg: this.state.nbMsg+=1});
        var conversationPush = this.state.conversation.slice();
        conversationPush.push({key: this.state.nbMsg, msg: this.state.response, from: "Human"});
        this._sendHumanAnswer();
        this.setState({
            conversation: conversationPush,
            response: ""
        });
    }

    _isHuman = (from) => {
        if (from === "Human")
            return true;
        return false;
    }

    render() {
        if (!this.state.loading)
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                    </View>
                    <ScrollView>
                        <Text>{this.state.data}</Text>
                        <View>
                            <FlatList
                                data={this.state.conversation}
                                renderItem={({item}) =>
                                    this._isHuman(item.from) &&
                                    <View style={styles.viewTextHumanAnswer}>
                                        <Text style={styles.textAnswer}>{item.msg}</Text>
                                    </View> ||
                                    !this._isHuman(item.from) &&
                                    <View style={styles.viewTextBotAnswer}>
                                        <Text style={styles.textAnswer}>{item.msg}</Text>
                                    </View>
                                }
                            />
                        </View>
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput style={styles.inputAnswer} underlineColorAndroid='transparent' placeholder='Envoyer un message'
                                   onChangeText={(response) => this.setState({response})} value={this.state.response}/>
                        <TouchableOpacity onPress={() => this._appendHumanAnswer()}>
                            <View style={styles.buttonAnswer}>
                                <Text style={styles.textButtonAnswer}>Envoyer</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        else
            return (
                <View>
                    <Text>On attend hein..</Text>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: height/12,
        backgroundColor: '#F2F2F2',
    },
    footer: {
        height: height/12,
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
    },
    inputAnswer: {
        flex: 1,
        width: width-(width/5),
        fontSize: 20,
        marginLeft: 10,
    },
    buttonAnswer: {
        flex: 1,
        backgroundColor: '#F5D0A9',
        width: width/5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButtonAnswer: {
        fontSize: 20,
        color: '#FFFFFF'
    },
    textAnswer: {
        fontSize: 18,
        color: '#FFFFFF'
    },
    viewTextBotAnswer: {
        backgroundColor: "#F7BE81",
        borderRadius: 5,
        margin: width/20,
        marginRight: width/5,
        padding: width/20,
    },
    viewTextHumanAnswer: {
        backgroundColor: "#BDBDBD",
        borderRadius: 5,
        margin: width/20,
        marginLeft: width/5,
        padding: width/20,
    },
});

export default App