const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.dailyJobNotifications = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async context => {
        //send notification towards each valid "user token"

        const dt = new Date();
        const dtWithFive = new Date();
        dtWithFive.setMinutes(dtWithFive.getMinutes() + 5);

        return admin
            .database()
            .ref("/notifications")
            .once("value")
            .then(data => {
                if (!data.val()) return;

                const snapshot = data.val();
                const tokensWithKey = [];
                const tokens = [];
                const payloads = [];

                const pastNotificationKeys = [];

                for (let key in snapshot) {
                    const performAt = new Date(snapshot[key].performAt);
                    const performAfter8Minutes = new Date(
                        snapshot[key].performAfter8Minutes
                    );
                    if (
                        (performAt >= dt && performAt <= dtWithFive) ||
                        (performAfter8Minutes >= dt &&
                            performAfter8Minutes <= dtWithFive)
                    ) {
                        tokens.push(snapshot[key].fcmToken);
                        tokensWithKey.push({
                            token: snapshot[key].fcmToken,
                            key: key
                        });
                        const bodyMessage = createNotificationBody(
                            snapshot[key]
                        );
                        payloads.push({
                            notification: {
                                title: `Reminder for your reservation at ${snapshot[
                                    key
                                ].barber.firstName.concat(
                                    " ",
                                    snapshot[key].barber.lastName
                                )}!`,
                                body: bodyMessage,
                                icon: snapshot[key].barber.profilePicture
                            }
                        });
                    }
                    if (performAt < dt) {
                        pastNotificationKeys.push(key);
                    }
                }

                console.log(tokens);
                console.log(tokensWithKey);
                console.log(payloads);
                return Promise.all(
                    tokens.map((token, index) =>
                        admin.messaging().sendToDevice(token, payloads[index])
                    )
                )
                    .then(responses => {
                        console.log("Responses: ", responses);
                        return responses.map(response =>
                            cleanInvalidTokens(tokensWithKey, response.results)
                        );
                    })
                    .then(() => cleanPastNotifications(pastNotificationKeys));
            });

        function createNotificationBody(payload) {
            const { startHour, date, serviceName } = payload;
            return `Mister, we are waiting for you at ${startHour} on ${date} for your booked service: ${serviceName}`;
        }

        // Clean invalid tokens
        function cleanInvalidTokens(tokensWithKey, results) {
            const invalidTokens = [];

            results.forEach((result, i) => {
                if (!result.error) return;

                console.error(
                    "Failure sending notification to",
                    tokensWithKey[i].token,
                    result.error
                );

                switch (result.error.code) {
                    case "messaging/invalid-registration-token":
                    case "messaging/registration-token-not-registered":
                        invalidTokens.push(
                            admin
                                .database()
                                .ref("/notifications")
                                .child(tokensWithKey[i].key)
                                .remove()
                        );
                        break;
                    default:
                        break;
                }
            });

            return Promise.all(invalidTokens);
        }

        function cleanPastNotifications(keys) {
            return Promise.all(
                keys.map(key =>
                    admin
                        .database()
                        .ref("/notifications")
                        .child(key)
                        .remove()
                )
            );
        }
    });
