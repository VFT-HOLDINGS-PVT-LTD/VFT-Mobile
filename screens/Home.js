import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, images, SIZES, FONTS } from '../constants'
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('UserDatabase.db');


const Home = () => {
  // const [username, setUserName] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    loadUserData();

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM tbl_u_attendancedata",
        [],
        (_, result) => {
          console.log('Have tbl_u_attendancedata', result);
          // txn.executeSql('DROP TABLE IF EXISTS tbl_u_attendancedata', []);
        },
        (_, error) => {
          console.error('Havent', error);
          txn.executeSql('DROP TABLE IF EXISTS tbl_u_attendancedata', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS tbl_u_attendancedata(EmpId INTEGER PRIMARY KEY  , AttDateTimeStr VARCHAR(255), Status VARCHAR(255), enrollNo VARCHAR(255))',
            [], (_, result) => {
              console.log('Table created tbl_u_attendancedata successfully!', result);
            },
            (_, error) => {
              console.error('Error creating tbl_u_attendancedata table:', error);
            },
          );
        }
      );
    });

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Reverse geocoding to get location name
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        setLocationName(geocode[0].city || geocode[0].name);
      } else {
        setLocationName('Location not found');
      }
    })();

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_empmaster;',
        [],
        (_, results) => {
          const len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              console.log(`Row ${i + 1}: id=${row.id}, username=${row.username}, password=${row.password}, enrollNo=${row.enrollNo}`);
              usernames.push(row.username);
            }
          } else {
            console.log('No data found');
          }
          setUsernames(usernames);
        },
        error => {
          console.error('Error executing SQL:', error);
        }
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_u_attendancedata;',
        [],
        (_, results) => {
          const len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              console.log(`Row ${i + 1}: id=${row.EmpId}, AttDateTimeStr=${row.AttDateTimeStr}, Status=${row.Status}, enrollNo=${row.enrollNo}`);
            }
          } else {
            console.log('No data found2');
          }
        },
        error => {
          console.error('Error executing SQL:', error);
        }
      );
    });

    DataUpload();
    const interval = setInterval(() => {
      setSelectedTime(new Date()); // Update the selected time every second
    }, 1000);

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };


  }, []);

  //access the localstorage
  const [serverDataName, serverData] = useState('');
  // This is to manage TextInput State 

  const loadUserData = async () => {
    try {
      // Retrieve the userName from AsyncStorage
      const serverDataLocal = await AsyncStorage.getItem('serverDataName');

      if (serverDataLocal !== null) {
        serverData(serverDataLocal);
        const apiData2 = `https://${serverDataLocal}/api/getAttData.php`;
        console.log('Data loaded successfullyNew2:', apiData2);
      } else {
        console.log('No data found in AsyncStorage2');
        // Open the model
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const DataUpload = async () => {
    try {
      // Retrieve the userName from AsyncStorage
      const serverDataLocal = await AsyncStorage.getItem('serverDataName');

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_u_attendancedata;',
        [],
        (_, results) => {
          const len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              const EmpNum = row.EmpId;
              const AttDate = row.AttDateTimeStr;
              const Stu = row.Status;
              const enRoll = row.enrollNo;

              const payload = {
                id: EmpNum,
                AttDateTimeStr: AttDate,
                Status: Stu,
                enrollNo: enRoll,
              };
              if (serverDataLocal !== null) {
                serverData(serverDataLocal);
                const apiData2 = `https://${serverDataLocal}/api/getAttData.php`;
                console.log('Data loaded successfullyNew3:', apiData2);
              
              // Make an API request to upload data
              fetch(apiData2, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              })
                // .then((response) => {
                //     // Log the response before parsing
                //     console.log('Raw response:', response);
                //     return response.json();
                // })
                .then((data) => {
                  // Handle response if needed
                  console.log('Cloud Upload:', data);
                })
                .catch((error) => {
                  console.error('Error Network:', error);
                });
              }
            }
            // Alert.alert('Data Uploading successful!');
          } else {
            console.log('No data found');
            // Alert.alert('Data Uploading Error');
          }
        },
        error => {
          console.error('Error executing SQL:', error);
          Alert.alert('Data Uploading Error');
        }
      );
    });
  } catch (error) {
    console.error('Error loading data:', error);
  }
  }


  // const loadUserData = async () => {
  //   try {
  //     // Retrieve the userName from AsyncStorage
  //   const savedUserName = await AsyncStorage.getItem('username');

  //     if (savedUserName !== null) {
  //       setUserName(savedUserName);
  //       console.log('Data loaded successfully:', savedUserName);
  //     } else {
  //       console.log('No data found in AsyncStorage');
  //     }
  //   } catch (error) {
  //     console.error('Error loading data:', error);
  //   }
  // };

  // Time
  // Time

  // Location

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  // Function to determine whether it's morning or evening
  const getGreeting = () => {
    const hour = selectedTime.getHours();
    if (hour >= 0 && hour < 12) {
      return 'Good Morning';
    } else {
      return 'Good Evening';
    }
  };

  const getFormattedDate = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const currentDate = new Date();
    const dayOfWeek = days[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    return `${dayOfWeek}, ${dayOfMonth} ${month}`;
  };
  // Function to get device ID
  const getDeviceID = () => {
    // Implement logic to retrieve device ID from the device
    // For example, you can use a library like react-native-device-info
    // and call its method to get the device ID
    return 'your_device_id'; // Replace 'your_device_id' with actual device ID
  };

  Check_In = () => {
    const DeviceID = "1234";
    const formattedDate = selectedTime.toISOString().split('T')[0]; // Extracting date in format "YYYY-MM-DD"
    const formattedDateTime = `${formattedDate} ${selectedTime.toLocaleTimeString()}`;
    // console.log('Selected date and time:', formattedDateTime); // Log the selected date and time together
    // Insert data into the database

    // db.transaction(tx => {
    //   tx.executeSql(
    //     'INSERT INTO tbl_u_attendancedata (AttDateTimeStr, Status, enrollNo) VALUES (?, ?, ?)',
    //     [ formattedDateTime, '1', "enrollNoFromEmpMaster"], // Replace 'your_device_id' with the actual device ID
    //     () => {
    //       Alert.alert('Success', 'Check-in successful!');
    //       console.log('Check-in successful!');
    //     },
    //     error => {
    //       console.error('Error inserting data:', error);
    //       Alert.alert('Error', 'Failed to check-in. Please try again.');
    //     }
    //   );
    // });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_empmaster;',
        [],
        (_, results) => {
          const len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              console.log(`Row ${i + 1}: id=${row.id}, username=${row.username}, password=${row.password}, enrollNo=${row.enrollNo}`);
              // Update tbl_u_attendancedata with enrollNo
              tx.executeSql(
                'INSERT INTO tbl_u_attendancedata (AttDateTimeStr, Status, enrollNo) VALUES (?, ?, ?)',
                [formattedDateTime, '1', row.enrollNo],
                () => {
                  Alert.alert('Success', 'Check-in successful!');
                  console.log('Check-in successful!');
                },
                error => {
                  console.error('Error inserting data:', error);
                  Alert.alert('Error', 'Failed to check-in. Please try again.');
                }
              );
            }
          } else {
            console.log('No data found');
          }
        },
        error => {
          console.error('Error executing SQL:', error);
        }
      );
    });


  };

  Check_Out = () => {
    const DeviceID = "1234";
    const formattedDate = selectedTime.toISOString().split('T')[0]; // Extracting date in format "YYYY-MM-DD"
    const formattedDateTime = `${formattedDate} ${selectedTime.toLocaleTimeString()}`;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_empmaster;',
        [],
        (_, results) => {
          const len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              console.log(`Row ${i + 1}: id=${row.id}, username=${row.username}, password=${row.password}, enrollNo=${row.enrollNo}`);
              // Update tbl_u_attendancedata with enrollNo
              tx.executeSql(
                'INSERT INTO tbl_u_attendancedata (AttDateTimeStr, Status, enrollNo) VALUES (?, ?, ?)',
                [formattedDateTime, '2', row.enrollNo],
                () => {
                  Alert.alert('Success', 'Check-Out successful!');
                  console.log('Check-Out successful!');
                },
                error => {
                  console.error('Error Check-Out inserting data:', error);
                  Alert.alert('Error', 'Failed to Check-Out. Please try again.');
                }
              );
            }
          } else {
            console.log('No data found Check-Out');
          }
        },
        error => {
          console.error('Error Check-Out executing SQL:', error);
        }
      );
    });


  };

  Break_In = () => {
    const DeviceID = "1234";
    const formattedDate = selectedTime.toISOString().split('T')[0]; // Extracting date in format "YYYY-MM-DD"
    const formattedDateTime = `${formattedDate} ${selectedTime.toLocaleTimeString()}`;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_empmaster;',
        [],
        (_, results) => {
          const len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              console.log(`Row ${i + 1}: id=${row.id}, username=${row.username}, password=${row.password}, enrollNo=${row.enrollNo}`);
              // Update tbl_u_attendancedata with enrollNo
              tx.executeSql(
                'INSERT INTO tbl_u_attendancedata (AttDateTimeStr, Status, enrollNo) VALUES (?, ?, ?)',
                [formattedDateTime, '3', row.enrollNo],
                () => {
                  Alert.alert('Success', 'Break-In successful!');
                  console.log('Break-In successful!');
                },
                error => {
                  console.error('Error inserting data:', error);
                  Alert.alert('Error', 'Failed to Break-In. Please try again.');
                }
              );
            }
          } else {
            console.log('Break-In No data found');
          }
        },
        error => {
          console.error('Break-In Error executing SQL:', error);
        }
      );
    });


  };

  Break_Out = () => {
    const DeviceID = "1234";
    const formattedDate = selectedTime.toISOString().split('T')[0]; // Extracting date in format "YYYY-MM-DD"
    const formattedDateTime = `${formattedDate} ${selectedTime.toLocaleTimeString()}`;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_empmaster;',
        [],
        (_, results) => {
          const len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              console.log(`Row ${i + 1}: id=${row.id}, username=${row.username}, password=${row.password}, enrollNo=${row.enrollNo}`);
              // Update tbl_u_attendancedata with enrollNo
              tx.executeSql(
                'INSERT INTO tbl_u_attendancedata (AttDateTimeStr, Status, enrollNo) VALUES (?, ?, ?)',
                [formattedDateTime, '4', row.enrollNo],
                () => {
                  Alert.alert('Success', 'Break-Out successful!');
                  console.log('Break-Out successful!');
                },
                error => {
                  console.error('Error Break-Out inserting data:', error);
                  Alert.alert('Error', 'Failed to Break-Out. Please try again.');
                }
              );
            }
          } else {
            console.log('No Break-Out data found');
          }
        },
        error => {
          console.error('Error Break-Out executing SQL:', error);
        }
      );
    });


  };

  // Location
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: COLORS.white
    }}>

      <View style={{
        marginHorizontal: 22,
        marginTop: -39
      }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={{
              width: 58,
              height: 22
            }}

          // onPress={Alert.alert("OK")}
          />

          <View>
            <View style={{
              position: "absolute",
              bottom: 16,
              width: 16,
              height: 16,
              borderRadius: 8,
              // backgroundColor: COLORS.black,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999
            }}>
              <Image
                source={images.image}
                resizeMode="contain"
                style={{
                  width: 128,
                  height: 65,
                  marginLeft: -96,
                  marginTop: 229,
                }}
              />
            </View>

          </View>
        </View>

        <ScrollView>
          <View >
            <View style={{
              marginHorizontal: 12,
              marginVertical: SIZES.padding,
              marginTop: 20,
              marginLeft: 7,
            }}>
              <View style={{
                // flexDirection: 'row',
                // justifyContent: 'center', // Center content horizontally
                // alignItems: 'center', // Center content vertically
                marginLeft: 4,
              }}>
                <Text style={{
                  fontSize: 25,
                  marginVertical: SIZES.padding * 2,
                }}>{getGreeting()},👋</Text>
                {usernames.map((username, index) => (
                  <Text key={index} style={{
                    fontSize: 40, fontWeight: "bold",
                    marginVertical: SIZES.padding * 2, marginTop: -17
                  }}>{username}</Text>
                ))}
                <Text style={{
                  fontSize: 15, fontWeight: "bold",
                  marginVertical: SIZES.padding * 2, marginTop: -17
                }}>Begin another graat day by clocking in.</Text>
              </View>



              <View style={{
                flexDirection: 'row', marginRight: -4, // Add some margin between the two views
              }}>
                <TouchableOpacity
                  onPress={this.ClickButton} // Trigger an alert on press
                  style={{
                    borderRadius: 10, // You can adjust the borderRadius as needed
                    backgroundColor: 'white', // Set your desired background color
                    shadowColor: 'rgb(95,99,104)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4, // Adjust the shadow radius as needed
                    elevation: 12, // For Android, you can also use elevation
                    // padding: 16, // Adjust padding as needed
                    borderRadius: 85,
                    borderWidth: 2,
                    borderColor: COLORS.gray,
                    backgroundColor: COLORS.white,
                    borderRadius: 20,
                    // marginTop: SIZES.padding,
                    width: '100%', // Set width to 50%
                    height: 200,
                    marginRight: 20, // Add some margin between the two views

                  }}>
                  <Text style={{ ...FONTS.h4, marginTop: 20, marginLeft: 20 }}> {getFormattedDate()}</Text>
                  <Text style={{ marginTop: 5, marginLeft: 8, fontSize: 55, fontWeight: "bold", color: 'rgb(3 218 166)' }}> {selectedTime.toLocaleTimeString()}</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.primary,
                      height: 44,
                      borderRadius: 6,
                      alignItems: "center",
                      justifyContent: "center",
                      width: '89%',
                      marginLeft: 20,
                      marginTop: 10
                    }}
                  >
                    <Text
                      style={{
                        ...FONTS.h4,
                        color: COLORS.white,
                      }}
                    >
                      {/* Location */}
                      {/* <Text>{text}</Text> */}
                      {locationName && <Text>Your Location: {locationName}</Text>}
                      {/* Select Your Location */}
                    </Text>
                    {/* Local DB Data view */}
                    {/* <Button title="View Data" onPress={handleViewData} /> */}

                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={this.Check_In} // Trigger an alert on press
                  style={{
                    borderRadius: 10, // You can adjust the borderRadius as needed
                    backgroundColor: 'white', // Set your desired background color
                    shadowColor: 'rgb(95,99,104)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4, // Adjust the shadow radius as needed
                    elevation: 12, // For Android, you can also use elevation
                    // padding: 16, // Adjust padding as needed
                    borderRadius: 85,
                    borderWidth: 2,
                    borderColor: COLORS.gray,
                    backgroundColor: COLORS.white,
                    borderRadius: 30,
                    marginTop: SIZES.padding,
                    width: '48%', // Set width to 50%
                    height: 180,
                    marginRight: 20, // Add some margin between the two views
                    alignItems: 'center', // Center content horizontally
                    justifyContent: 'center', // Center content vertically
                  }}>
                  <Image
                    source={images.image2}
                    style={{ width: 80, height: 80, marginLeft: -0 }} // Adjust the image size as needed
                  />
                  <Text style={{ marginTop: 15, fontSize: 18 }}>Check In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.Check_Out} // Trigger an alert on press
                  style={{
                    borderRadius: 10, // You can adjust the borderRadius as needed
                    backgroundColor: 'white', // Set your desired background color
                    shadowColor: 'rgb(95,99,104)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4, // Adjust the shadow radius as needed
                    elevation: 12, // For Android, you can also use elevation
                    // padding: 16, // Adjust padding as needed
                    borderRadius: 85,
                    borderWidth: 2,
                    borderColor: COLORS.gray,
                    backgroundColor: COLORS.white,
                    borderRadius: 30,
                    marginTop: SIZES.padding,
                    width: '48%', // Set width to 50%
                    height: 180,
                    alignItems: 'center', // Center content horizontally
                    justifyContent: 'center', // Center content vertically
                    borderWidth: 2,
                  }}>
                  <Image
                    source={images.image3}
                    style={{ width: 80, height: 80, marginLeft: 0 }} // Adjust the image size as needed
                  />
                  <Text style={{ marginTop: 15, fontSize: 16 }}>Check Out</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={this.Break_In} // Trigger an alert on press
                  style={{
                    borderRadius: 10, // You can adjust the borderRadius as needed
                    backgroundColor: 'white', // Set your desired background color
                    shadowColor: 'rgb(95,99,104)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4, // Adjust the shadow radius as needed
                    elevation: 12, // For Android, you can also use elevation
                    // padding: 16, // Adjust padding as needed
                    borderRadius: 85,
                    borderWidth: 2,
                    borderColor: COLORS.gray,
                    backgroundColor: COLORS.white,
                    borderRadius: 30,
                    marginTop: SIZES.padding,
                    width: '48%', // Set width to 50%
                    height: 180,
                    marginRight: 20, // Add some margin between the two views
                    alignItems: 'center', // Center content horizontally
                    justifyContent: 'center', // Center content vertically
                    borderWidth: 2,
                  }}>
                  <Image
                    source={images.image4}
                    style={{ width: 80, height: 80, marginLeft: 10 }} // Adjust the image size as needed
                  />
                  <Text style={{ marginTop: 15, fontSize: 18 }}>Break In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.Break_Out} // Trigger an alert on press
                  style={{
                    borderRadius: 10, // You can adjust the borderRadius as needed
                    backgroundColor: 'white', // Set your desired background color
                    shadowColor: 'rgb(95,99,104)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4, // Adjust the shadow radius as needed
                    elevation: 12, // For Android, you can also use elevation
                    // padding: 16, // Adjust padding as needed
                    borderRadius: 85,
                    borderWidth: 2,
                    borderColor: COLORS.gray,
                    backgroundColor: COLORS.white,
                    borderRadius: 30,
                    marginTop: SIZES.padding,
                    width: '48%', // Set width to 50%
                    height: 180,
                    alignItems: 'center', // Center content horizontally
                    justifyContent: 'center', // Center content vertically
                    borderWidth: 2,
                  }}>
                  <Image
                    source={images.image5}
                    style={{ width: 90, height: 90, marginLeft: -10 }} // Adjust the image size as needed
                  />
                  <Text style={{ marginTop: 5, fontSize: 18 }}>Break Out</Text>
                </TouchableOpacity>
              </View>
              {/* <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={this.ClickButton}
                  style={{
                    backgroundColor: "",
                    borderRadius: 330,
                    marginTop: SIZES.padding,
                    width: 100,
                    height: 100,
                    marginHorizontal: 5, // Adjust horizontal margin as needed
                    alignItems: 'center', // Center content horizontally
                    justifyContent: 'center', // Center content vertically
                  }}>
                  <Image
                    source={images.image6}
                    style={{ width: 80, height: 80, }} // Adjust the image size as needed
                  />
                </TouchableOpacity>
              </View> */}



            </View>


            {/* 
                  <FlatList
                      horizontal={true}
                      data={shoesList1}
                      keyExtractor={item => item.id}
                      renderItem={
                          ({ item, index }) => (
                              <Image
                                  source={item.shoes}
                                  resizeMode="contain"
                              />
                          )
                      }
                  /> */}

            {/* <FlatList
                      horizontal={true}
                      data={shoesList2}
                      keyExtractor={item => item.id}
                      renderItem={
                          ({ item, index }) => (
                              <Image
                                  source={item.shoes}
                                  resizeMode="contain"
                              />
                          )
                      }
                  /> */}
            {/* <ScrollView> */}

            {/* <View style={{
                      marginHorizontal: 12,
                      marginVertical: SIZES.padding,
                  }}>
                      <FlatList
                          data={this.state.data}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                              <View style={{
                                  backgroundColor: COLORS.gray,
                                  borderRadius: 30,
                                  marginTop: SIZES.padding,
                                  width: SIZES.width - 67,
                                  height: 150,
                                  marginRight: 50
                              }}>
                                  <Text></Text>
                                  <Text style={{ marginLeft: 20, }}>RollNo: {item.username}</Text>
                                  <Text style={{ marginLeft: 20, marginRight: 50 }}>RollNo: {item.password}</Text>

                                    </View>
                          )}
                      />


                  </View> */}
            {/* </ScrollView> */}
          </View>

          {/* <ScrollView> */}
          {/* <View style={{
                  marginBottom: 120
              }}>
                  <Text style={{
                      ...FONTS.h3,
                      marginVertical: SIZES.padding * 2
                  }}>The Latest and Greatest</Text>

                  <FlatList
                      horizontal={true}
                      data={latestList}
                      keyExtractor={item => item.id}
                      renderItem={
                          ({ item, index }) => (
                              <View style={{
                                  marginRight: SIZES.padding
                              }}>
                                  <TouchableOpacity
                                      onPress={() => navigation.navigate("Details")}
                                  >
                                      <Image
                                          source={item.image}
                                          style={{
                                              height: 140,
                                              width: 140
                                          }}
                                      />
                                  </TouchableOpacity>


                                  <TouchableOpacity
                                      onPress={() => navigation.navigate("Details")}
                                  >
                                      <Text style={{
                                          fontSize: 14,
                                          color: COLORS.black,
                                          fontWeight: "bold"
                                      }}>
                                          {item.name}
                                      </Text>
                                  </TouchableOpacity>

                                  <Text style={{
                                      fontSize: 10,
                                      color: COLORS.black
                                  }}>
                                      {item.category}
                                  </Text>

                                  <View style={{
                                      flexDirection: "row"
                                  }}>
                                      {
                                          item.oldPrice !== item.price && (
                                              <Text style={{
                                                  fontSize: 12,
                                                  marginVertical: 4,
                                                  marginRight: 6,
                                                  textDecorationColor: COLORS.black,
                                                  textDecorationLine: "line-through"
                                              }}>
                                                  ${item.oldPrice}
                                              </Text>
                                          )
                                      }

                                      <Text style={{
                                          fontSize: 12,
                                          marginVertical: 4
                                      }}>
                                          ${item.price}
                                      </Text>
                                  </View>
                              </View>
                          )
                      }
                  />
              </View> */}
        </ScrollView>
      </View>
    </SafeAreaView >
  )
}

export default Home