import React, { Component, useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Image, SafeAreaView, StyleSheet, Text, View, TextInput, FlatList, Alert, ScrollView, Modal } from 'react-native';
import Button from "./components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from 'expo-sqlite';
// import DialogInput from 'react-native-dialog-input';
import Hyperlink from "react-native-hyperlink";
// import { openDatabase } from 'react-native-sqlite-storage';
const db = SQLite.openDatabase('UserDatabase.db');

export function HomeUi({ navigation }) {
    useEffect(() => {
        // Load saved data on component mount
        loadUserData();
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT * FROM tbl_empmaster",
                [],
                (_, result) => {
                    console.log('Have', result);
                    // txn.executeSql('DROP TABLE IF EXISTS tbl_empmaster', []);
                },
                (_, error) => {
                    console.error('Havent', error);
                    txn.executeSql('DROP TABLE IF EXISTS tbl_empmaster', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS tbl_empmaster(user_id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(255), password VARCHAR(255), enrollNo VARCHAR(255))',
                        [], (_, result) => {
                            console.log('Table created successfully!', result);
                        },
                        (_, error) => {
                            console.error('Error creating table:', error);
                        },
                    );
                }
            );
        });
    }, []);

    //access the localstorage
    const [serverDataName, serverData] = useState('');
    // This is to manage TextInput State 
    const [inputValue, setInputValue] = useState("");
    // save data in localstorage
    const saveData2 = async () => {
        try {
            await AsyncStorage.setItem('serverDataName', inputValue);
            console.log('Data saved successfully2');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const loadUserData = async () => {
        try {
            // Retrieve the userName from AsyncStorage
            const serverDataLocal = await AsyncStorage.getItem('serverDataName');

            if (serverDataLocal !== null) {
                serverData(serverDataLocal);
                const apiData2 = `https://${serverDataLocal}/api/test2.php`;
                console.log('Data loaded successfullyNew:', apiData2);
            } else {
                console.log('No data found in AsyncStorage2');
                toggleModalVisibility();
                // Open the model
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // This is to manage Modal State 
    const [isModalVisible, setModalVisible] = useState(false);
    // Open and close modal upon button clicks. 
    const toggleModalVisibility = () => {
        setModalVisible(!isModalVisible);
    };

    // const Database = async () => {
    // };

    get = () => {
        console.log(apiData2);
        saveData2();
        loadUserData();
        console.log(apiData2);
        Alert.alert("Success");
    }

    const [userName, setuserName] = useState(''); // Define state for RollNo
    const [Password, setPassword] = useState(''); // Define state for StudentName

    const apiData2 = `https://${serverDataName}/api/test2.php`;
    InsertRecord = () => {

        // Construct the request payload
        const payload = {
            username: userName,
            password: Password,
        };

        // Make an API request to your PHP script
        fetch(apiData2, {
            method: 'POST', // You might need to change this based on your API
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                if (data == "noData") {
                    console.log("PW Error:", apiData2);
                    Alert.alert("PW Error");
                } else {
                    db.transaction(function (txn) {
                        txn.executeSql(
                            "SELECT * FROM tbl_empmaster",
                            [],
                            (_, result) => {
                                const len = result.rows.length;
                                if (len > 0) {
                                    Alert.alert("Success");
                                    navigation.navigate("BottomTabNavigation");
                                } else {
                                    db.transaction(function (tx) {
                                        tx.executeSql(
                                            'INSERT INTO tbl_empmaster (username, password, enrollNo) VALUES (?, ?, ?);',
                                            [userName, Password,data["Enroll_No"]],
                                            (tx, results) => {
                                                if (results.rowsAffected > 0) {
                                                    console.log('Data inserted the DB successfully');
                                                    Alert.alert("Success");
                                                    navigation.navigate("BottomTabNavigation");
                                                } else {
                                                    console.warn('Failed to insert the DB data');
                                                }
                                            },
                                            error => {
                                                console.error('DB Insert Error executing SQL:', error);
                                            }
                                        );
                                    });
                                }
                            },
                            (_, error) => {
                                console.error('Login Error', error);
                            }
                        );
                    });
                    console.log("Success2:", apiData2);
                    // console.log(data["Enroll_No"]);
                    Alert.alert("Success");
                    // navigation.navigate("BottomTabNavigation");
                }
            })
            .catch((error) => {
                console.error('Error Network:', error);
                db.transaction(function (txn) {
                    txn.executeSql(
                        "SELECT * FROM tbl_empmaster",
                        [],
                        (_, result) => {
                            const len = result.rows.length;
                            if (len > 0) {
                                const firstRow = result.rows.item(0);
                                const storedUserName = firstRow.username;
                                const storedPassword = firstRow.password;
                                if (storedUserName == userName && storedPassword == Password) {
                                    // For demonstration purposes, log in using console
                                    console.log('Logging in with stored data:', storedUserName, storedPassword);
                                    Alert.alert("Success");
                                    navigation.navigate("BottomTabNavigation");
                                } else {
                                    console.log('Typing Error');
                                    Alert.alert("Typing Error");
                                }
                            } else {
                                console.log('DB Data Error');
                            }
                        },
                        (_, error) => {
                            console.error('Plz Turn On Your Internet', error);
                        }
                    );
                });

                this.setState({ responseMessage: 'Network error occurred.' });
            });
    };

    // const saveData = async () => {
    //     try {
    //         await AsyncStorage.setItem('userName', userName);
    //         await AsyncStorage.setItem('password', Password);
    //         // await AsyncStorage.setItem('inputvalue', inputValue);
    //         console.log('Data saved successfully');
    //     } catch (error) {
    //         console.error('Error saving data:', error);
    //     }
    // };

    const ui = (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    // flex: 1, // This will center the image both horizontally and vertically
                    justifyContent: 'center', // Center vertically
                    alignItems: 'center', // Center horizontally
                }}>
                    <Image
                        source={{
                            uri: 'https://www.vftholdings.lk/img/vft_footer.png',
                        }}
                        style={{
                            width: 160,
                            height: 160,
                        }}
                    />
                </View>

                <View style={{
                    marginVertical: 22, justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        marginLeft: 30
                        // color: COLORS.black
                    }}>
                        Welcome ! 👋
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        // color: COLORS.black
                    }}>Please enter your username & password</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Username</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        // borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your username'
                            // placeholderTextColor={COLORS.black}
                            // keyboardType='email-address'
                            style={{
                                width: 340
                            }}
                            onChangeText={(text) => setuserName(text)} // Update RollNo state
                        // value={username}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Password</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        // borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Password'
                            // placeholderTextColor={COLORS.black}
                            // keyboardType='email-address'
                            style={{
                                width: 340
                            }}
                            onChangeText={(text) => setPassword(text)} // Update RollNo state
                        // onChangeText={(StudentName) => this.setState({ StudentName })}
                        // value={username}
                        />
                    </View>

                    <View>

                    </View>


                </View>

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>

                    <Text>Remenber Me</Text>
                </View>

                <Button onPress={this.InsertRecord}
                    title="Login"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                        width: 360
                    }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: '#CCCCCC',
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14 }}>VFT HOLDINGS (PVT) LTD</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: '#CCCCCC',
                            marginHorizontal: 10
                        }}
                    />

                </View>

                <Hyperlink linkDefault={true}>
                    <Text onPress={toggleModalVisibility}>
                        Server Configuration ➤
                    </Text>
                </Hyperlink>

                {/** This is our modal component containing textinput and a button */}
                <Modal animationType="slide"
                    transparent visible={isModalVisible}
                    presentationStyle="overFullScreen"
                // onDismiss={toggleModalVisibility}
                >
                    <View style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                    }}>


                        <View style={{
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            top: "30%",
                            //  left: "50%", 
                            elevation: 5,
                            //  transform: [{ translateX: -(wiidth * 0.4) },  
                            //              { translateY: -90 }], 
                            height: 280,
                            backgroundColor: "#fff",
                            borderRadius: 8,
                            width: "80%",
                            // borderColor: COLORS.black,
                            borderWidth: 1,
                        }}>


                            <Text style={{
                                fontSize: 12,
                                fontWeight: 400,
                                marginVertical: 8,
                                marginTop: -20,
                                fontWeight: "bold",
                            }}>Server Configuration: {serverDataName}</Text>

                            <TextInput placeholder="Enter Server Name..." style={{
                                borderWidth: 1, borderRadius: 8, height: 45,
                                width: 280, alignItems: "center",
                                justifyContent: "center",
                                paddingLeft: 22,
                                marginTop: 10,
                                // valueOf:inputvalue,
                            }}
                                // value={inputValue}
                                // onChangeText={(value) => setInputValue(value)}
                                onChangeText={(text) => setInputValue(text)} />

                            <Button onPress={this.get}
                                title="Save"
                                filled
                                style={{
                                    marginTop: 18,
                                    marginBottom: 4,
                                    width: 260,
                                    height: 50,
                                }}
                            />

                            <Button onPress={toggleModalVisibility}
                                title="Close"
                                filled
                                style={{
                                    marginTop: 5,
                                    marginBottom: 4,
                                    width: 260,
                                    height: 50,
                                }}
                            />

                        </View>
                    </View>
                </Modal>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>

                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>

                </View>
            </ScrollView>
        </SafeAreaView>

    );
    return ui;


}

export default HomeUi;
