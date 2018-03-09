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
let token = 'Bearer aDgDHJDvtXQ.cwA.5iM.7dg1yBydyqmtqOSZbjdmgDm7XU_6uSnY5sguq6fc0W8';
let key = 'b51d0f39d02c4efcbd92856214932bc7';

class App extends Component {

    constructor() {
        super();
        this.state = {
            response: "",
            buttonResponse: "",
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
                Authorization: token,
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

    _getLanguage = () => {
        fetch('https://dev.microsofttranslator.com/languages?api-version=1.0&scope=speech', {
            headers: {
                Accept: 'application/json',
                'Accept-Language': 'fr'
            }})
            .then((response) => response.json())
            .done();
    }

    _getToken = () => {
        fetch('https://api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Content-Type': 'application/json',
                Accept: 'application/jwt',

            }})
            .then((response) => response.json())
            .done();
    }

    _speechTranslator = () => {

        var ws = wsClient();

        

        fetch('wss://dev.microsofttranslator.com/speech/translate?api-version=1.0&from=en&to=fr', {
            headers: {
                'Ocp-Apim-Subscription-Key': key,


            }})
            .then((response) => response.json())
            .done();
    }

    _getBotAnswer = () => {
        fetch("https://directline.botframework.com/api/conversations/"+this.state.idConversation+"/messages", {
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.messages.length === this.state.nbMsg) {
                    this._getBotAnswer();
                }
                else {
                    var msg = this.state.nbMsg;
                    while (msg < responseJson.messages.length) {
                        if (this._isOptionBotAnswer(responseJson.messages[msg].text)) {
                            this._createChoice(responseJson.messages[msg].text);
                        }
                        this._apprendBotAnswer(responseJson.messages[msg].text);
                        msg++;
                    }
                }
            })
            .done();
    }
    _sendHumanAnswer = (answer) => {
        Alert.alert(this.state.idConversation)
        fetch("https://directline.botframework.com/api/conversations/"+this.state.idConversation+"/messages", {
            method: 'POST',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: answer,
                user: 'Human',
            }),
        })
            .then(() => {
                this._getBotAnswer()
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
    _appendHumanAnswer = (buttonValue) => {
        this.setState({ nbMsg: this.state.nbMsg+=1 });
        var conversationPush = this.state.conversation.slice();
        conversationPush.push({key: this.state.nbMsg, msg: buttonValue, from: "Human"});
        this._sendHumanAnswer(buttonValue);
        this.setState({
            conversation: conversationPush,
            response: ""
        });
    }
    _createChoice = (msg) => {
        var find = "";
        var len =  (msg.match(/\*/g) || []).length;
        if (len) {
            var i = 1;
            while (i < len) {
                find += "(\\*\\s(.+)\\s+)";
                i++;
            }
            find += "(\\*\\s(.+))";
        }
        var result = msg.match(find);
        result.splice(0, 1);
        i = 0;
        while (i < len) {
            result.splice(i, 1);
            i++;
        }
        j = 0;
        while (j < result.length) {
            if (result[j]) {
                var conversationPush = this.state.conversation.slice();
                conversationPush.push({key: this.state.nbMsg, msg: msg, value: result[j], from: "Bot"});
                this.setState({
                    conversation: conversationPush,
                });
            }
            j++;
        }
    }
    _isOptionBotAnswer = (msg) => {
        if (/Options:/.test(msg))
            return true;
        return false;
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
                                    !this._isHuman(item.from) && !this._isOptionBotAnswer(item.msg) &&
                                    <View style={styles.viewTextBotAnswer}>
                                        <Text style={styles.textAnswer}>{item.msg}</Text>
                                    </View> ||
                                    !this._isHuman(item.from) && this._isOptionBotAnswer(item.msg) &&
                                    item.value &&
                                    <TouchableOpacity onPress={() => this._appendHumanAnswer(item.value)}>
                                        <View style={styles.viewTextHumanButtonAnswer}>
                                            <Text style={styles.textButtonAnswer}>{item.value}</Text>
                                        </View>
                                    </TouchableOpacity>

                                }
                            />
                        </View>
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput style={styles.inputAnswer} underlineColorAndroid='transparent' placeholder='Envoyer un message'
                                   onChangeText={(response) => this.setState({response})} value={this.state.response}/>
                        <TouchableOpacity onPress={() => this._appendHumanAnswer(this.state.response)}>
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
    viewTextHumanButtonAnswer: {
        backgroundColor: "#F5D0A9",
        borderRadius: 5,
        marginLeft: width/20,
        marginBottom: width/60,
        marginRight: width/5,
        padding: width/40,
    },
    textButtonAnswer: {
        fontSize: 18,
        color: '#FFFFFF'
    },
});

export default App