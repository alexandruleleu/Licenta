import firebase from "react-native-firebase";

export default class AppointmentService {
    constructor() {}

    //formatting date for tabs list
    datePipeForTabsList = day => {
        const weekday = new Array(7);
        weekday[0] = "sun";
        weekday[1] = "mon";
        weekday[2] = "tue";
        weekday[3] = "wed";
        weekday[4] = "thu";
        weekday[5] = "fri";
        weekday[6] = "sat";

        let monthDay = day.getDate();
        if (day.getDate() < 10) {
            monthDay = "0".concat(monthDay);
        }
        return (formattedDate = weekday[day.getDay()].concat(" ", monthDay));
    };

    datePipeForAppointmentsList = day => {
        let monthDay = day.getDate().toString();
        let month = (day.getMonth() + 1).toString();
        if (day.getDate() < 10) {
            monthDay = "0".concat(monthDay);
        }
        if (day.getMonth() < 10) {
            month = "0".concat(month);
        }
        return monthDay.concat("-", month, "-", day.getFullYear());
    };

    getNextNDays = (n, startDate) => {
        let formattedDates = [];
        for (i = 1; i <= n; i++) {
            let increased = new Date(
                startDate.getTime() + 1000 * 60 * 60 * 24 * i
            );
            formattedDates.push({
                tabDate: this.datePipeForTabsList(increased),
                listDate: this.datePipeForAppointmentsList(increased)
            });
        }
        return formattedDates;
    };

    //format of appointment list item
    handleAppointmentsListFormat = barberInfo => {
        appointmentListFormat = [];
        for (
            let i = barberInfo.startHourValue;
            i < barberInfo.finishHourValue;
            i += 0.5
        ) {
            appointmentListFormat.push({
                start: i,
                customer: "",
                startHourValue: this.slotTimePipe(i),
                finishHourValue: this.slotTimePipe(i + 0.5),
                break: false
            });
        }
        return appointmentListFormat;
    };

    setBreakHour = (appointmentsList, barberInfo) => {
        let breakSlots = [
            barberInfo.breakHourValue,
            barberInfo.breakHourValue + 0.5
        ];
        appointmentsList.map(item => {
            if (breakSlots.includes(item.start)) {
                item.break = true;
            }
            return item;
        });
        return appointmentsList;
    };

    slotTimePipe = value => {
        let startHour = "";
        if (value % 1 !== 0) {
            startHour = (value - 0.5).toString().concat(":30");
        } else {
            startHour = value.toString().concat(":00");
        }
        if (value < 10) {
            startHour = "0".concat(startHour);
        }
        return startHour;
    };

    getAppointmentsStructurePipe = (formattedDates, appointmentsList) => {
        appointmentsStructure = {};
        formattedDates.map(item => {
            appointmentsStructure[item.listDate] = appointmentsList;
        });
        return appointmentsStructure;
    };

    getAppointmentsByDay = (barberId, day) => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("appointments")
                .child(barberId)
                .child(day)
                .on("value", snapshot => {
                    if (snapshot.val() !== null) {
                        resolve(snapshot.val());
                    } else {
                        reject("empty");
                    }
                });
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

    setNewAppointment = (
        customerId,
        barberId,
        day,
        payloadBarber,
        payloadCustomer,
        payloadForBarberCalendar
    ) => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("appointments")
                .child(barberId)
                .child(day)
                .update(payloadBarber)
                .then(() => {
                    firebase
                        .database()
                        .ref("customers")
                        .child(customerId)
                        .child("my_appointments")
                        .push()
                        .set(payloadCustomer)
                        .then(() => {
                            firebase
                                .database()
                                .ref("barbers")
                                .child(barberId)
                                .child("my_calendar")
                                .child(day)
                                .update(payloadForBarberCalendar)
                                .then(() => {
                                    this.setNewNotification(
                                        payloadCustomer,
                                        customerId
                                    );
                                    resolve("continue");
                                });
                        });
                });
        });
    };

    setNewNotification = (payloadCustomer, customerId) => {
        firebase
            .database()
            .ref("customers")
            .child(customerId)
            .once("value", snapshot => {
                const { date, startHour } = payloadCustomer;
                const dt = new Date();
                const FCM_TOKEN = snapshot.val().fcmToken;
                let day = parseInt(date.substring(0, 2));
                let mon = parseInt(date.substring(3, 5));
                let year = parseInt(date.substring(6, 10));
                let hours = parseInt(startHour.substring(0, 2)) - 2;
                let minutes = parseInt(startHour.substring(3, 5));

                let performAtValue = new Date(
                    year,
                    mon - 1,
                    day,
                    hours,
                    minutes
                );

                let performAfter8MinutesValue = dt.setMinutes(
                    dt.getMinutes() + 8
                );
                firebase
                    .database()
                    .ref("notifications")
                    .push()
                    .set({
                        ...payloadCustomer,
                        fcmToken: FCM_TOKEN,
                        performAt: performAtValue,
                        performAfter8Minutes: performAfter8MinutesValue
                    });
            });
    };

    //mock data
    setNewAppointments = barberId => {
        appointments = {
            "8": {
                customerId: "UPy1mi6dLHXUqvbCrVL04595Qgy2",
                first_name: "Ana",
                last_name: "Blonda",
                profile_picture: "",
                service_name: "Speciality Haircut"
            },
            "8,5": {
                customerId: "bFZWeF11EKQZSxzSyKKSipYB7UH3",
                first_name: "Bogdan",
                last_name: "Carbune",
                profile_picture: "",
                service_name: "Speciality Haircut"
            },
            "11": {
                customerId: "UPy1mi6dLHXUqvbCrVL04595Qgy2",
                first_name: "Ana",
                last_name: "Blonda",
                profile_picture: "",
                service_name: "Full Service Haircut"
            }
        };
        firebase
            .database()
            .ref("appointments")
            .child(barberId)
            .child("05-01-2019")
            .set(appointments);
    };
}
