import firebase from "react-native-firebase";

export default class HomeCustomerService {
    constructor() {}

    getAllBarbers = () => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("barbers")
                .once("value", snapshot => {
                    if (snapshot.val() !== null) {
                        resolve(this.snapshotToArray(snapshot));
                    } else {
                        err = "Custom error";
                        reject(err);
                    }
                });
        });
    };

    //filter logic
    calcDistanceBetweenTwoPoints = (lat1, lon1, lat2, lon2) => {
        var p = 0.017453292519943295; // Math.PI / 180
        var cos = Math.cos;
        var a =
            0.5 -
            cos((lat2 - lat1) * p) / 2 +
            (cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p))) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    };

    addBarberDistanceField = (data, { currentLatitude, currentLongitude }) => {
        return data.map(item => {
            if (item.location) {
                item.distance = this.calcDistanceBetweenTwoPoints(
                    currentLatitude,
                    currentLongitude,
                    item.location.latitude,
                    item.location.longitude
                );
                return item;
            } else return item;
        });
    };

    filterProfessionals = (data, nameValue, distanceValue) => {
        if (nameValue !== "") {
            let fullName;
            return data.filter(item => {
                fullName = item.firstName
                    .toLowerCase()
                    .concat(" ", item.lastName.toLowerCase());
                if (!item.distance) return false;
                return (
                    fullName.includes(nameValue.toLowerCase()) &&
                    item.distance <= distanceValue
                );
            });
        } else {
            return data.filter(item => {
                if (!item.distance) return false;
                return item.distance <= distanceValue;
            });
        }
    };

    getTop10Barbers = () => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("barbers")
                .orderByChild("reviews", "desc")
                .limitToFirst(10)
                .once("value", snapshot => {
                    if (snapshot.val() !== null) {
                        console.log(snapshot.val());
                        resolve(this.snapshotToArray(snapshot).reverse());
                    } else {
                        err = "Custom error";
                        reject(err);
                    }
                });
        });
    };

    getFavoriteBarbers = payload => {
        return new Promise((resolve, reject) => {
            if (payload.val() !== null) {
                let favoriteBarbers = [];
                payload.forEach(childSnapshot => {
                    let barberId = childSnapshot.val();
                    firebase
                        .database()
                        .ref("barbers")
                        .child(barberId)
                        .once("value", snapshot => {
                            let item = snapshot.val();
                            item.barberId = snapshot.key;
                            favoriteBarbers.push(item);
                        })
                        .then(() => {
                            resolve(favoriteBarbers);
                        });
                });
            } else {
                const err = "no favorites";
                reject(err);
            }
        });
    };

    getUserData = id => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("customers")
                .child(id)
                .once("value", snapshot => {
                    resolve(snapshot.val());
                });
        });
    };

    getCustomerAppointments = id => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("customers")
                .child(id)
                .child("my_appointments")
                .once("value", snapshot => {
                    let returnArr = [];
                    snapshot.forEach(childSnapshot => {
                        let item = childSnapshot.val();
                        returnArr.push(item);
                    });
                    resolve(returnArr);
                });
        });
    };

    //remove from appointments list
    removeCustomerAppointment = (item, customerId) => {
        return new Promise((resolve, reject) => {
            const ref = firebase
                .database()
                .ref("customers")
                .child(customerId)
                .child("my_appointments");
            ref.once("value")
                .then(snapshot => {
                    snapshot.forEach(function(childSnapshot) {
                        //remove each child
                        if (
                            childSnapshot.val().barber.barberId ===
                                item.barber.barberId &&
                            childSnapshot.val().date === item.date &&
                            childSnapshot.val().start === item.start
                        ) {
                            ref.child(childSnapshot.key).remove();
                        }
                    });
                })
                .then(() => {
                    firebase
                        .database()
                        .ref("barbers")
                        .child(item.barber.barberId)
                        .child("my_calendar")
                        .child(
                            item.date.concat(
                                "/",
                                item.start.toString().replace(".", ",")
                            )
                        )
                        .remove()
                        .then(() => {
                            firebase
                                .database()
                                .ref("appointments")
                                .child(item.barber.barberId)
                                .child(
                                    item.date.concat(
                                        "/",
                                        item.start.toString().replace(".", ",")
                                    )
                                )
                                .remove()
                                .then(() => {
                                    if (item.time === "60") {
                                        firebase
                                            .database()
                                            .ref("appointments")
                                            .child(item.barber.barberId)
                                            .child(
                                                item.date.concat(
                                                    "/",
                                                    (item.start + 0.5)
                                                        .toString()
                                                        .replace(".", ",")
                                                )
                                            )
                                            .remove()
                                            .then(() => {
                                                resolve("continue");
                                            });
                                    } else {
                                        resolve("continue");
                                    }
                                });
                        });
                });
        });
    };

    convertDate = date => {
        let day = parseInt(date.substring(0, 2));
        let mon = parseInt(date.substring(3, 5));
        let year = parseInt(date.substring(6, 10));

        let convertedDate = new Date(year, mon - 1, day);
        return convertedDate.toString().split(" ", 4);
    };

    snapshotToArray(snapshot) {
        let returnArr = [];

        snapshot.forEach(childSnapshot => {
            let item = childSnapshot.val();
            item.barberId = childSnapshot.key;

            returnArr.push(item);
        });

        return returnArr;
    }
}
