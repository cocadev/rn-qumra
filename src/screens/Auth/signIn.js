import React, { Component } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, Dimensions, Image, ActivityIndicator } from 'react-native';
import CustomStyle from '../../common/c_style';
import firebase from 'firebase';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { showMessage } from "react-native-flash-message";
import * as ATOM from '../../components/atoms';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'eugene19950901@outlook.com',
            password: '123qwe',
            isWaiting: false
        }
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    _loadInitialState = async () => {
        var value = await AsyncStorage.getItem('user');
        if (value !== null) {
            this.props.navigation.navigate('Map');
        }
    }

    render() {
        const { isWaiting } = this.state
        return (
            <LinearGradient colors={['#020407', '#2d3e50']} style={{ flex: 1 }}>

               { isWaiting && <ATOM.Loading />} 

                <View style={CustomStyle.wrapper}>
                    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, padding: p(12) }}>

                        <TouchableOpacity onPress={() => Actions.pop()}>
                            <Icon name="ios-arrow-round-back" color={COLORS.white} size={p(36)} />
                        </TouchableOpacity>

                        <View style={{ padding: p(1), alignItems: 'center' }}>
                            <Image source={images.logo_full} style={{ width: p(200), height: p(60), marginTop: p(20), marginBottom: p(40) }} />
                            <Text style={{ color: '#fff', fontSize: p(12), marginBottom: p(6), textAlign: 'center' }}>Sign in to continue</Text>
                        </View>

                        <TextInput
                            style={CustomStyle.textInput}
                            placeholder='Email'
                            placeholderTextColor={COLORS.light_color}
                            onChangeText={(email) => this.setState({ email })}
                            underlineColorAndroid='transparent'
                            value={this.state.email}

                        />

                        <TextInput
                            style={CustomStyle.textInput}
                            placeholder='Password'
                            placeholderTextColor={COLORS.light_color}
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({ password })}
                            underlineColorAndroid='transparent'
                            value={this.state.password}

                        />

                        <TouchableOpacity onPress={this.login}>
                            <View style={CustomStyle.btn}>
                                <Text style={{ color: '#2d3e50', fontSize: p(17) }}> Log in</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
                            {/* <Text style={{color: 'white', padding: 5}}>Don't have an account?</Text> */}
                            <TouchableOpacity onPress={() => Actions.signup()}>
                                <Text style={{ alignSelf: 'center', color: 'white', fontSize: p(14) }}>Create an account  </Text>
                            </TouchableOpacity>

                            {/* <View style={{flexDirection:'column'}}></View>   */}
                            <TouchableOpacity onPress={() => Actions.forgotPassword()}>
                                <Text style={{ alignSelf: 'center', color: 'white', fontSize: p(14) }}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={{ marginTop: p(120) }}>
                            <View style={CustomStyle.SignUp}>
                                <Text style={{ color: 'white', fontSize: p(17) }}> Sign in with your Phone number </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this.onPhotographerLoginPress}
                            style={{ marginTop: p(20) }}>
                            <View style={CustomStyle.SignUp}>
                                <Text style={{ color: 'white', fontSize: p(17) }}> Sign In as a Photographer </Text>
                            </View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>

            </LinearGradient>

        );
    }

    onForgotPasswordPress = () => {
        this.props.navigation.navigate("ForgetPassword")
    }

    onSignUpPressed = () => {
        this.props.navigation.navigate("Registration")
    }

    onPhotographerLoginPress = () => {
        this.props.navigation.navigate("PhotographerLogin")
    }

    login = () => {
        this.setState({ isWaiting: true})
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                this.setState({ isWaiting: false})
                Actions.profile()
            })
            .catch(error => {
                this.setState({ isWaiting: false})
                showMessage({
                    message: "Fail Login",
                    description: error.message,
                    type: "danger",
                    icon: "danger"
                });
            })

    }
}

