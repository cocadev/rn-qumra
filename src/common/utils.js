import firebase from 'firebase';
import { COLORS } from './colors';

class UtilService {

    static LocalDateTime(date) {
        var d = new Date(date);
        return d.toLocaleTimeString();
    }

    ////////////////////////
    /////  getTimeTime /////
    ////////////////////////
    static getNameAvatarPhotographers(uid) {
        return new Promise((resolve, reject) => {
            firebase.database().ref(`/photographers/${uid}/user`).once('value')
                .then(function (res) {
                    var result = JSON.parse(JSON.stringify(res));
                    myResult = result.fullName;

                    return resolve(myResult);
                })
                .catch(e => {
                    return reject(e);
                })
        });
    }

    static acceptColor(status) {

        let color = COLORS.red_color;

        if (status == 'pending') { color = COLORS.red_color}
        if (status == 'accept' || status == 'accepted') { color = '#A7CE38'}
        if (status == 'open' || status == 'opened') { color = '#3D874F'}
        if (status == 'reject' || status == 'rejected') { color = 'grey'}
        if (status == 'cancel' || status == 'cancelled' ) { color = 'lightblue'}
        if (status == 'close' || status == 'closed') { color = 'orange'}

        return color;
    }

    

    static getDatebylongNumber(date) {
        let d = new Date(date);
        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return "0" + string;
            }
            return string;
        };

        const monthFilter = number => {
            var month = 'Dec'
            if (number == 1) { return "Jan"; }
            if (number == 2) { return "Feb"; }
            if (number == 3) { return "Mar"; }
            if (number == 4) { return "Apr"; }
            if (number == 5) { return "May"; }
            if (number == 6) { return "Jun"; }
            if (number == 7) { return "Jul"; }
            if (number == 8) { return "Aug"; }
            if (number == 9) { return "Sep"; }
            if (number == 10) { return "Oct"; }
            if (number == 11) { return "Nov"; }

            return month;
        };

        let year = d.getFullYear()
        return padWithZero(monthFilter(d.getMonth() + 1)) + ' ' + padWithZero(d.getDate()) + ' ' + year.toString()
    }

    static getDatebyTMDB(date) {
        let d = new Date(date);
        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return "0" + string;
            }
            return string;
        };
        let year = d.getFullYear()
        return year + '-' + padWithZero(d.getMonth() + 1) + '-' + padWithZero(d.getDate())
    }


    ////////////////////////
    ///// date systeme /////
    ////////////////////////
    static getDateTime(date) {
        let d = new Date(date);
        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return "0" + string;
            }
            return string;
        };
        let year = d.getFullYear()
        return padWithZero(d.getMonth() + 1) + '/' + padWithZero(d.getDate()) + '/' + year.toString().substring(2)
    }

    ////////////////////////
    /////  getTimeTime /////
    ////////////////////////
    static getTimeTime(date) {
        let d = new Date(date);
        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return "0" + string;
            }
            return string;
        };
        let year = d.getFullYear()
        return padWithZero(d.getMonth() + 1) + '/' + padWithZero(d.getDate()) + '/' + year.toString().substring(2)
    }

    static getHourMinutes(myDate) {

        var date = myDate - new Date().getTimezoneOffset()*600000;

        let dd = new Date(date)

        let h = dd.getHours(), m = dd.getMinutes()
        let AP = ' AM'
        if (h > 12) {
            h = h - 12;
            AP = ' PM'
        }
        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return "0" + string;
            }
            return string;
        };
        let year = dd.getFullYear()

        return padWithZero(dd.getMonth() + 1) + '/' + padWithZero(dd.getDate()) + '/' + year.toString() + " " + padWithZero(h) + ':' + padWithZero(m) + AP
    }

    static getDay(date) {
        let dd = new Date(date)
        let h = dd.getDay()
        if (h == 0) {
            AP = ' Sunday '
        } if (h == 1) {
            AP = ' Monday '
        } if (h == 2) {
            AP = ' Tuesday '
        } if (h == 3) {
            AP = ' Wednesday '
        } if (h == 4) {
            AP = ' Thirsday '
        } if (h == 5) {
            AP = ' Friday '
        } if (h == 6) {
            AP = ' Saturday '
        }
        return AP
    }

    ////////////////////////
    ///// Order Situation system /////
    ////////////////////////
    static getOrderSituation1(accept) {
        var response = null
        if (accept == 'pending') {
            response = 'Your request is pending. Please wait.'
        }
        if (accept == 'reject' || accept == 'rejected') {
            response = 'Sorry. Your request is rejected.'
        }
        if (accept == 'accept' || accept == 'accepted') {
            response = 'Congratulations. Your request is accepted. \nPlease meet this photographer.'
        }
        if (accept == 'open' || accept == 'opened') {
            response = 'Congratulations. You meeted this photographer. \nHave fun!'
        }
        if (accept == 'cancel' || accept == 'cancelled') {
            response = 'This order cancelled!'
        }
        if (accept == 'closed' || accept == 'closed') {
            response = 'Congratulations. This order completed!\n Please leave review for this photographer.'
        }
        if (accept == 'reviewed') {
            response = 'Congratulations. Finished!'
        }
       
        return response
    }

    static getOrderSituation2(accept) {
        var response = null
        if (accept == 'pending') {
            response = 'You received new request from this user.'
        }
        if (accept == 'reject' || accept == 'rejected') {
            response = 'You rejected this request.'
        }
        if (accept == 'accept' || accept == 'accepted') {
            response = 'You accepted this request. \nPlease meet this user.'
        }
        if (accept == 'open' || accept == 'opened') {
            response = null
            // response = 'Congratulations. You meeted this user. \nPlease start your work.'
        }
        if (accept == 'cancel' || accept == 'cancelled') {
            response = 'This order cancelled!'
        }
        if (accept == 'closed' || accept == 'closed') {
            response = 'Congratulations. This order completed! \nPlease leave review for this user.'
        }
        if (accept == 'reviewed') {
            response = 'Congratulations. Finished!'
        }
       
        return response
    }

    static getUTCtime(myDate) {

        var now = myDate.getTime() + myDate.getTimezoneOffset()*600000;
        return now;
    }
}

export default UtilService
