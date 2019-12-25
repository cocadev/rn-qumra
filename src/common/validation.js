
import { showMessage } from "react-native-flash-message";

class ValidationService {

    static updatePhotographer(fullname, summary, rate, availbility, turnOn) {
        var errors = null;
        if(!fullname){ errors = 'FullName cannot be null'}
        if(!summary){ errors = 'Summary cannot be null'}
        if(!rate){ errors = 'Rate cannot be null'}
        if(turnOn && !availbility){ errors = 'Availability cannot be null'}

        if(errors){
            showMessage({
                message: "Fail",
                description: errors,
                type: "danger",
                icon: "danger"
              });
            return true
        } else {
            return false
        }
    }

    static giveReview(review, starCount) {
        var errors = null;
        if(!starCount){ errors = 'Rating should be at least 1'}
        if(!review){ errors = 'review cannot be null'}

        if(errors){
            showMessage({
                message: "Fail",
                description: errors,
                type: "danger",
                icon: "danger"
              });
            return true
        } else {
            return false
        }

    }

}

export default ValidationService
