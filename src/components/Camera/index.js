import React, { Component } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import {
    ImageBackground,
    TouchableOpacity,
    Image,
    Linking,
    Platform,
    Text,
    TextInput,
    Modal,
} from 'react-native';
import {
    Container,
    Header,
    Content,
    Left,
    Button,
    Body,
    Right,
    Icon,
    Title,
} from 'native-base';

import { RNCamera, FaceDetector } from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import commonData from '../../common/data.js';

import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { alertWithTwoBtn } from '../../common/user';
var { width, height } = Dimensions.get('window');
var opacityValue = 0.4;
// create a component
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
const flash_off = require('../../assets/imgs/flash-off.png');
const flash_on = require('../../assets/imgs/flash-on.png');
const camera_flip = require('../../assets/imgs/camera-flip.png');
const camera_btn = require('../../assets/imgs/camera_btn.png');

var cameraAuthorize = false;

// create a component
class Camera extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            flash: RNCamera.Constants.FlashMode.off,
            cameraToggle: this.props.current_image_selection == 'profile' ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back,
            text: "",
            disabled: false,
            canSkip: true,
            header: true,
            faceData: this.props.current_image_selection == 'profile' ? [] : [{ id: 1 }],
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        console.log("back Presss")
        this.props.backButton('back_camera');
        return true;
    }

    takePicture = async () => {
        console.log('take');
        this.setState({ disabled: true });
        if (this.camera) {
            const options = { quality: 0.4, base64: true };
            const data = await this.camera.takePictureAsync(options);
            console.log(data, "data...");
            if (this.props.current_image_selection != "profile") {
                this.props.getImageUri("camera_click", {
                    uri: 'data:image/jpeg;base64,' + data.base64,
                    path: data.uri,
                    full_object: data
                });
            } else {
                ImagePicker.openCropper({
                    path: data.uri,
                    mediaType: 'photo',
                    cropping: true,
                    cropperChooseText: 'Next',
                    compressImageQuality: 0.8,
                    cropperToolbarTitle: 'Crop',
                    cropperCircleOverlay: false,
                    includeBase64: true,
                    cropperToolbarTitle: 'Move/Pinch to Zoom',
                    avoidEmptySpaceAroundImage: true,
                }).then(
                    image => {
                        this.setState({ disabled: false });
                        this.props.getImageUri("camera_click", {
                            uri: 'data:image/jpeg;base64,' + image.data,
                            path: image.path,
                            full_object: image
                        });
                    },
                    error => {
                        this.setState({ disabled: false });
                        //  console.log(error, 'eroro');
                    },
                );
            }
            // this.props.getImageUri("camera_click", {
            //     uri: 'data:image/jpeg;base64,' + data.base64,
            //     path: data.uri,
            //     full_object: data
            // });
            // commonData.signupParam.append('profile_image', {
            //   uri: data.uri,
            //   name: 'selfie.jpg',
            //   type: 'image/jpg',
            // });

            // ImagePicker.openCropper({
            //     path: data.uri,
            //     includeBase64: true,
            //     cropperCircleOverlay: true,
            //     cropperToolbarTitle: 'Move and Scale',
            //     avoidEmptySpaceAroundImage: true,
            // }).then(
            //     image => {
            //         console.log(image);
            //         this.setState({ disabled: false });
            //         this.props.getImageUri({
            //             uri: 'data:image/jpeg;base64,' + image.data,
            //             path: image.path,
            //         });
            //     },
            //     error => {
            //         this.setState({ disabled: false });
            //         console.log(error, 'eroro');
            //     },
            // );
        }
    };

    chooseAction = action => {
        switch (action) {
            case 'gallery': {
                console.log('clik gallery');

                check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
                    console.log(result, 'result');
                    switch (result) {
                        case RESULTS.DENIED:
                            console.log('deny case call');
                            request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
                                console.log(result, 'resul1111t');
                                if (result == "granted") {
                                    ImagePicker.openPicker({
                                        mediaType: 'photo',
                                        // width: 300,
                                        // height: 400,
                                        cropping: false,
                                        cropperChooseText: 'Next',
                                        compressImageQuality: 0.8,
                                        cropperToolbarTitle: 'Crop',
                                        cropperCircleOverlay: true,
                                        includeBase64: true,
                                        cropperToolbarTitle: 'Move and Scale',
                                        avoidEmptySpaceAroundImage: true,
                                    }).then(
                                        image => {
                                            this.setState({ disabled: false });
                                            this.props.getImageUri("camera_click", {
                                                uri: 'data:image/jpeg;base64,' + image.data,
                                                path: image.path,
                                                full_object: image
                                            });
                                        },
                                        error => {
                                            opacityValue = 0.4;
                                            this.setState({ disabled: false });
                                            console.log(error, 'eroro');
                                        },
                                    );
                                }
                            });

                            break;
                        case RESULTS.GRANTED:
                            opacityValue = 1;
                            // this.setState({disabled: this.state.disabled});
                            ImagePicker.openPicker({
                                mediaType: 'photo',
                                // width: 300,
                                // height: 400,
                                cropping: false,
                                cropperChooseText: 'Next',
                                compressImageQuality: 0.8,
                                cropperToolbarTitle: 'Crop',
                                cropperCircleOverlay: true,
                                includeBase64: true,
                                cropperToolbarTitle: 'Move and Scale',
                                avoidEmptySpaceAroundImage: true,
                            }).then(
                                image => {
                                    this.setState({ disabled: false });
                                    this.props.getImageUri("camera_click", {
                                        uri: 'data:image/jpeg;base64,' + image.data,
                                        path: image.path,
                                        full_object: image
                                    });
                                },
                                error => {
                                    opacityValue = 0.4;
                                    this.setState({ disabled: false });
                                    console.log(error, 'eroro');
                                },
                            );
                            break;
                        case RESULTS.BLOCKED:
                            alertWithTwoBtn(
                                'Permission Required',
                                commonData.ToastMessages.access_gallery,
                                'Not Now',
                                'Open Settings',
                            ).then(data => {
                                console.log(data);
                                if (data) {
                                    Linking.openSettings();
                                }
                            });
                        //     break;
                    }
                });

                break;
            }

            default:
                break;
        }
    };
    cameraHandler = feature => {
        switch (feature) {
            case 'flash': {
                console.log('flash');
                if (this.state.flash == RNCamera.Constants.FlashMode.on) {
                    this.setState({ flash: RNCamera.Constants.FlashMode.off });
                } else {
                    this.setState({ flash: RNCamera.Constants.FlashMode.on });
                }
                break;
            }
            case 'camera': {
                if (this.state.cameraToggle == RNCamera.Constants.Type.back) {
                    this.setState({ cameraToggle: RNCamera.Constants.Type.front });
                } else {
                    this.setState({ cameraToggle: RNCamera.Constants.Type.back });
                }
                break;
            }
            case 'enableAcess': {
                alertWithTwoBtn(
                    'Permission Required',
                    commonData.ToastMessages.camera_deny_permission,
                    'Not Now',
                    'Open Settings',
                ).then(data => {
                    console.log(data);
                    if (data) {
                        Linking.openSettings();
                    } else {
                    }
                });
                break;
            }
            case 'skip': {
                this.props.skip('skip');
                break;
            }
            case 'back': {
                console.log("back Presss")
                this.props.backButton('back_camera');
                break;
            }
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <View
                    style={[
                        {
                            position: 'absolute',
                            top: this.state.header ? '3%' : '5%',
                            flex: 1,
                            zIndex: 1,
                        },
                        styles.header,
                    ]}>
                    <Button
                        transparent
                        disabled={this.state.disabled}
                        hitSlop={hitSlop}
                        onPress={() => {
                            this.cameraHandler('back');
                        }}>
                        <Icon
                            style={[
                                styles.iconStyle,
                                { opacity: this.state.disabled ? 0.4 : 1 },
                            ]}
                            name="arrow-back"
                        />
                    </Button>
                    {/* {this.state.header && (
                        <Button
                            transparent
                            disabled={this.state.disabled}
                            hitSlop={hitSlop}
                            onPress={() => { }}>
                            <Text
                                style={{
                                    paddingRight: 90,
                                    color: colors.LIGHT_COLOR,
                                    fontFamily: 'OpenSans-Bold',
                                    //  fontWeight: '400',
                                    paddingTop: 5,
                                    fontSize: 20,
                                }}>
                                Upload Profile Picture
                    </Text>
                        </Button>
                    )} */}
                </View>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    captureAudio={false}
                    style={styles.preview}
                    type={this.state.cameraToggle}
                    flashMode={this.state.flash}
                    // ratio="4:3"
                    androidCameraPermissionOptions={{
                        title: 'Permission to Tap to open Camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        //  console.log(barcodes);
                    }}

                    onFacesDetected={({ faces }) => {
                        console.log(this.props.current_image_selection, "current_image_selection")
                        if (this.props.current_image_selection == 'profile') {
                            this.setState({
                                faceData: faces
                            })
                        }

                    }}
                    onFaceDetectionError={({ faces }) => {
                        console.log(faces, "onFaceDetectionError");
                    }}


                >
                    {({ camera, status }) => {
                        let authorizeStatus = camera._reactInternalFiber.memoizedState.isAuthorizationChecked;
                        cameraAuthorize = authorizeStatus;
                        // console.log(status, camera.state, 'camera status...');
                        if (status !== 'READY' && !authorizeStatus) {
                            return (
                                <View style={styles.outer_container}>
                                    <View style={styles.top_container}>
                                        <Text style={styles.upload_text}>{this.state.text}</Text>
                                        <Button
                                            hitSlop={hitSlop}
                                            style={styles.enable_btn}
                                            onPress={() => {
                                                this.cameraHandler('enableAcess');
                                            }}>
                                            <Text style={styles.enable_btn_txt}>Enable Access</Text>
                                        </Button>
                                    </View>
                                </View>
                            );
                        }
                    }}
                </RNCamera>

                <View style={styles.bottom_container}>
                    <LinearGradient
                        colors={['transparent', '#000']}
                        style={styles.linearGradient}>
                        <View style={[styles.camera_control, { width: width, }]}>
                            <TouchableOpacity
                                style={[styles.flash_touch, { width: width / 3 - 11, marginRight: -4, }]}
                                disabled={this.state.disabled}
                                onPress={() => this.cameraHandler('flash')}>
                                <Image
                                    style={[
                                        styles.flash_icon,
                                        { opacity: this.state.disabled ? 0.4 : 1 },
                                    ]}
                                    source={
                                        this.state.flash == RNCamera.Constants.FlashMode.on
                                            ? flash_on
                                            : flash_off
                                    }
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.camera_touch]}
                                disabled={(this.state.faceData.length == 0 || this.state.faceData.length == 0) ? true : false}
                                disabled={this.state.disabled && this.state.faceData.length != 0}
                                onPress={() => {
                                    this.takePicture();
                                }}>
                                <Image
                                    style={[
                                        styles.camera_butn,
                                        { opacity: (this.state.faceData.length == 0 || this.state.disabled) ? 0.4 : 1 },
                                        // { opacity: this.state.disabled ? 0.4 : 1 },
                                    ]}
                                    source={camera_btn}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.flip_touch, { paddingBottom: 11 }]}
                                disabled={this.state.disabled}
                                onPress={() => this.cameraHandler('camera')}>
                                <Image
                                    style={[
                                        styles.flip_icon,
                                        { opacity: this.state.disabled ? 0.4 : 1 },
                                    ]}
                                    source={camera_flip}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* {this.props.current_image_selection != "profile" && ( */}
                        <View style={[styles.camera_control, { marginBottom: 25 }]}>
                            <TouchableOpacity
                                hitSlop={hitSlop}
                                style={styles.upload_touch}
                                onPress={() => {
                                    this.chooseAction('gallery');
                                }}>
                                <Text
                                    style={[
                                        styles.segment_text,
                                        { opacity: this.state.disabled ? 0.4 : opacityValue, paddingRight: 7 },
                                    ]}>
                                    UPLOAD
                                    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity hitSlop={hitSlop} style={styles.photo_touch}>
                                <Text
                                    style={[
                                        styles.segment_text,
                                        { opacity: this.state.disabled ? 0.4 : 1 },
                                    ]}>
                                    PHOTO
                                    </Text>
                            </TouchableOpacity>
                        </View>

                        {/* )} */}
                        {this.props.current_image_selection == "profile" && cameraAuthorize && (
                            <View style={[styles.camera_control, { width: width, paddingBottom: 20, justifyContent: 'center' }]}>
                                <Text style={{ fontSize: 18, fontFamily: 'OpenSans-Bold', color: this.state.faceData.length == 0 ? colors.danger : colors.geen_txt, }}>
                                    {this.getText()}
                                </Text>
                            </View>
                        )}


                    </LinearGradient>
                </View>
            </View>
        );
    }

    getText() {
        console.log(cameraAuthorize, "cameraAuthorize")
        if (this.props.current_image_selection == "profile") {
            return this.state.faceData.length == 0 ? "Face not Detected. Please stay still." : "Face  Detected";
        } else {
            return ""
        }

    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },

    skip_text: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        paddingTop: 5,
        paddingRight: 20,
        letterSpacing: 0.8,
    },

    header: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width,
    },
    pageTitle: {
        fontFamily: 'OpenSans-Bold',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10,
    },
    outer_container: {
        flex: 1,
        bottom: '45%',
    },
    top_container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    upload_text: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 23,
        color: colors.LIGHT_COLOR,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
        letterSpacing: 0.8,
    },

    enable_btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: colors.LIGHT_COLOR,
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
    },
    enable_btn_txt: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        letterSpacing: 0.7,
        paddingRight: 30,
        paddingLeft: 30,
    },
    linearGradient: {
        flex: 1,
        paddingTop: 40,
    },
    bottom_container: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        justifyContent: 'flex-end',
    },
    camera_control: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    flash_touch: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: width / 3,
    },
    flip_touch: {
        alignItems: 'flex-start',
        width: width / 3,
        justifyContent: 'center',
        paddingTop: 20,
    },
    camera_touch: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    upload_touch: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: width / 2,
        paddingRight: 30,
    },
    photo_touch: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: width / 2,
        paddingLeft: 30,
    },
    segment_text: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 17,
        paddingBottom: 10,
        letterSpacing: 0.8,
    },
    flash_icon: {
        width: 30,
        height: 25,
        resizeMode: 'contain',
        //marginLeft: 19,
        //  left: 0,
        //  backgroundColor: 'red'
    },
    flip_icon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    camera_butn: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    iconStyle: {
        color: colors.GRAY_BACK,
        fontSize: 35,
    },
});

//make this component available to the app
export default Camera;
