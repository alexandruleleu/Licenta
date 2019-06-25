import firebase from "react-native-firebase";

export default class ProfessionalDetailsService {
    constructor(barberId, customerId) {
        this.barberId = barberId;
        this.customerId = customerId;
    }

    //add one review
    increaseBarberReviews = () => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("barbers")
                .child(this.barberId)
                .once("value", snapshot => {
                    return snapshot.val().reviews;
                })
                .then(rsp => {
                    this.addNewReview(rsp.val().reviews).then(() => {
                        resolve("continue");
                    });
                });
        });
    };

    addNewReview = reviews => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("barbers")
                .child(this.barberId)
                .update({ reviews: ++reviews })
                .then(() => {
                    resolve("continue");
                });
        });
    };

    //remove one review
    decreaseBarberReviews = () => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("barbers")
                .child(this.barberId)
                .once("value", snapshot => {
                    return snapshot.val().reviews;
                })
                .then(rsp => {
                    this.reduceReview(rsp.val().reviews).then(() => {
                        resolve("continue");
                    });
                });
        });
    };

    reduceReview = reviews => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("barbers")
                .child(this.barberId)
                .update({ reviews: --reviews })
                .then(() => {
                    resolve("continue");
                });
        });
    };

    //add to favorite list
    addToFavoriteBarbers = () => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("customers")
                .child(this.customerId)
                .child("favorite_barbers")
                .push()
                .set(this.barberId)
                .then(() => {
                    resolve("continue");
                });
        });
    };

    //remove from favorite list
    removeFromFavoriteBarbers = () => {
        return new Promise((resolve, reject) => {
            const ref = firebase
                .database()
                .ref("customers")
                .child(this.customerId)
                .child("favorite_barbers");
            ref.orderByValue()
                .equalTo(this.barberId)
                .once("value")
                .then(snapshot => {
                    snapshot.forEach(function(childSnapshot) {
                        //remove each child
                        ref.child(childSnapshot.key).remove();
                    });
                })
                .then(() => {
                    resolve("continue");
                });
        });
    };

    checkFavoriteList = () => {
        return new Promise((resolve, reject) => {
            const ref = firebase
                .database()
                .ref("customers")
                .child(this.customerId)
                .child("favorite_barbers");

            ref.orderByValue()
                .equalTo(this.barberId)
                .once("value", snapshot => {
                    if (snapshot.val() !== null) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
        });
    };
}
