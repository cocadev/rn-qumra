import firebase from 'firebase';
import { showMessage } from "react-native-flash-message";
import _ from 'underscore'
import UtilService from './utils';

export default {

    //////////////////////////////
    //////////////////////////////
    async getPgReviews() {
        return new Promise(function (resolve, reject) {
            var array = [];
            firebase.database().ref(`/photographers/SwUKVg2NVUT5fFHylnTguAWK7TJ2/user/reviews`).once("value", (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    var childData = childSnapshot.val();
                    firebase.database().ref(`/users/${childData.employer}`).on('value', function (ddd) {
                        array.push({
                            userName: ddd.val().user.fullName,
                            userAvatar: ddd.val().user.avatar,
                            rating: childData.rating,
                            review: childData.review,
                            date: childData.date
                        })
                        resolve(array)
                    })
                });
            })
        })
    },

    async userSignUp(fullName, email, birthday, latitude, longitude) {
        return new Promise(function async(resolve, reject) {

            const { currentUser } = firebase.auth();
            const users = firebase.database().ref(`/members`)

            users.once("value", function (snapshot) {
                var index = parseInt(snapshot.numChildren() + 1)

                const user = {
                    type: 'user',
                    id: currentUser.uid,
                    fullName: fullName,
                    email: email,
                    location: `${latitude},${longitude}`,
                    birthday: birthday,
                    qumraId: index,

                }
                firebase.database().ref(`/members/${'user-' + index}`).set(user);
                resolve(user)
            })
        })
    },

    userUpdate(currentUser, email, fullname, phone, uploadResult) {
        return new Promise(function async(resolve, reject) {

            firebase.database().ref(`/members`).orderByChild("id").equalTo(currentUser.id).once('child_added', function (snapshot) {
                var key = snapshot.key;
                firebase.database().ref(`/members/${key}`)
                    .update({
                        email: email,
                        fullName: fullname,
                        phoneNumber: phone,
                        avatar: uploadResult
                    })
                    .then((res) => {
                        showMessage({ message: "Success Request", description: "Great", type: "success", icon: "success" });
                        resolve(res)
                    })
                    .catch(error => {
                        showMessage({ message: "Fail Request", description: error.message, type: "danger", icon: "danger" });
                        reject(false)
                    })

            })
        })
    },

    async pgSignUp(email, fullName, birthday, latitude, longitude) {
        return new Promise(function async(resolve, reject) {

            const { currentUser } = firebase.auth();
            const users = firebase.database().ref(`/members`)

            users.once("value", function (snapshot) {
                var index = parseInt(snapshot.numChildren() + 1)
                const user = {
                    type: 'pg',
                    id: currentUser.uid,
                    qumraId: index,
                    fullName: fullName,
                    email: email,
                    location: `${latitude},${longitude}`,
                    birthday: birthday,
                    turnOn: true,
                    availbility: 'Not Available',
                    rate: 20,
                    male: 0
                }
                firebase.database().ref(`/members/${'pg-' + index}`).set(user);
                resolve(user)
            })
        })
    },

    pgUpdate(summary, fullname, rate, male, turnOn, availbility, uploadResult, myProfilePics) {

        const { currentUser } = firebase.auth();

        return new Promise(function async(resolve, reject) {
            firebase.database().ref(`/members`).orderByChild("id").equalTo(currentUser.uid).once('child_added', function (snapshot) {
                var key = snapshot.key;
                firebase.database().ref(`/members/${key}`)
                    .update({
                        summary: summary,
                        fullName: fullname,
                        rate: rate,
                        male: male,
                        turnOn: turnOn,
                        avatar: uploadResult,
                        availbility: availbility,
                        myProfilePics: myProfilePics
                    })
                    .then((res) => {
                        showMessage({ message: "Success Request", description: "Great", type: "success", icon: "success" });
                        resolve(res)
                    })
                    .catch(error => {
                        showMessage({ message: "Fail Request", description: error.message, type: "danger", icon: "danger" });
                        reject(false)
                    })
            })
        })
    },

    async usersCheck(email) {
        var data = null
        await firebase.database().ref(`/members`).orderByChild("email").equalTo(email).on('child_added', function (snapshot) {
            return data = snapshot.val()
        })

        return new Promise(function async(resolve, reject) {

            if (data && data.type == 'user') {
                resolve(true)
            } else {
                showMessage({
                    message: "Fail Login",
                    description: "Unauthorized User",
                    type: "danger",
                    icon: "danger"
                });
                reject(false)
            }
        })
    },

    async pgCheck(email) {
        var data = null
        await firebase.database().ref(`/members`).orderByChild("email").equalTo(email).on('child_added', function (snapshot) {
            return data = snapshot.val()
        })

        return new Promise(function async(resolve, reject) {

            if (data && data.type == 'pg') {
                resolve(true)
            } else {
                showMessage({
                    message: "Fail Login",
                    description: "Unauthorized Photographer",
                    type: "danger",
                    icon: "danger"
                });
                reject(false)
            }
        })
    },
    sendRequest(currentUser, photographer, msg, latitude, longitude) {

                if (currentUser.qumraId > photographer.qumraId) {
                    var ChatID = `${currentUser.qumraId}-${photographer.qumraId}`;
                } else {
                    var ChatID = `${photographer.qumraId}-${currentUser.qumraId}`;
                }

                const refChat = firebase.database().ref(`/chat/${ChatID}`)
                const refOrder = firebase.database().ref(`/orders`)
                const refNotification = firebase.database().ref(`/notifications/${ChatID}`)

                var length = 0
                var length_notify = 0
                var length_order = 0

                refChat.on("value", function (snapshot) {
                    length = snapshot.numChildren()
                })
                refOrder.on("value", function (snapshot) {
                    length_order = snapshot.numChildren()
                })
                refNotification.on("value", function (snapshot) {
                    length_notify = snapshot.numChildren()
                })

                refChat.child(parseInt(length + 1))
                    .set({
                        sender: currentUser.qumraId,
                        receiver: photographer.qumraId,
                        text: msg,
                        seen: false,
                        createdAt: UtilService.getUTCtime(new Date()),
                    });

                refOrder.child(ChatID)
                    .update({
                        createdAt: UtilService.getUTCtime(new Date()),
                        updatedAt: UtilService.getUTCtime(new Date()),
                        sender: currentUser.qumraId,
                        order: "Qumra" + currentUser.qumraId + photographer.qumraId,
                        receiver: photographer.qumraId,
                        accept: "pending",
                        latitude: latitude,
                        longitude: longitude
                    });

                refNotification.child(parseInt(length_notify + 1))
                    .set({
                        sender: currentUser.qumraId,
                        receiver: photographer.qumraId,
                        text: `Request from ${currentUser.fullName}`,
                        createdAt: UtilService.getUTCtime(new Date()),
                        seen: false,
                    });

                showMessage({
                    message: "Success",
                    description: "Sent your request. Please wait",
                    type: "success",
                    icon: "success"
                });

    },

    sendMessage(currentUserUid, opposite, message) {

        if (currentUserUid > opposite) {
            var ChatID = `${currentUserUid}-${opposite}`;
        } else {
            var ChatID = `${opposite}-${currentUserUid}`;
        }
        const refChat = firebase.database().ref(`/chat/${ChatID}`)
        var length = 0
        refChat.on("value", function (snapshot) {
            length = snapshot.numChildren()
        })
        var msg = {
            createdAt: UtilService.getUTCtime(new Date()),
            sender: currentUserUid,
            receiver: opposite,
            text: message,
            seen: false
        }
        refChat.child(length + 1).set(msg);

    },

    orderUpdateAddPhotos(pgId, userId, myProfilePics) {

        if (pgId > userId) {
            var ChatID = `${pgId}-${userId}`;
        } else {
            var ChatID = `${userId}-${pgId}`;
        }

        return new Promise(function async(resolve, reject) {
            firebase.database().ref(`/orders/${ChatID}`)
                    .update({
                        photoes: myProfilePics
                    })
                    .then((res) => {
                        showMessage({ message: "Success Request", description: "Great", type: "success", icon: "success" });
                        resolve(res)
                    })
                    .catch(error => {
                        showMessage({ message: "Fail Request", description: error.message, type: "danger", icon: "danger" });
                        reject(false)
                    })
            
        })
    },
}

