import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, images, SIZES, FONTS } from '../constants'
import DropDownPicker from 'react-native-dropdown-picker';
// import Button from '../components/Button';
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from 'expo-location';




const Messages = () => {

  // const [location, setLocation] = useState(null);
  // const [errorMsg, setErrorMsg] = useState(null);

  // useEffect(() => {
  //   (async () => {

  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  // let text = 'Waiting..';
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }

  // Dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Annual Leave ', value: '1' },
    { label: 'Casual Leave', value: '2' },
    { label: 'Sick Leave', value: '3' },
  ]);


  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const handleDateChangeEnd = (date) => {
    setSelectedEndDate(date);
  };

  const handleOnPressEndDate = () => {
    setOpenEndDatePicker(!openEndDatePicker);
  };
  // Date Time Picker

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startDate = tomorrow.toISOString(); // Format the date as a string
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [startedDate, setStartedDate] = useState("Y-m-d");
  const [startedTime, setStartedTime] = useState("H:i:s");

  const handleDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedStartTime(time);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  const handleOnPressStartTime = () => {
    setOpenStartTimePicker(!openStartTimePicker);
  };

  // const [isVisible, setIsVisible] = useState(true);

  this.state = {
    data: [], // Store the data from the API here
  };
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: COLORS.white
    }}>
      <View style={{
        marginHorizontal: 22,
        marginTop: 12
      }}>

        <View>

          <View
            style={{
              marginHorizontal: 12,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: "absolute",
                left: 0,
              }}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={COLORS.black}
              />
            </TouchableOpacity>

            <Text style={{ ...FONTS.h3 }}>Leave Request</Text>
          </View>
        </View>

        {/* <View style={styles.container}>
          <Text style={styles.paragraph}>{text}</Text>
        </View> */}
        {/* <View>
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
                source={images.image6}
                resizeMode="contain"
                style={{
                  width: 1280,
                  height: 650,
                  marginLeft: 370,
                  marginTop: 829,
                }}
              />
            </View>

          </View> */}

        <ScrollView style={{
          marginBottom: 12, marginTop: 44,
        }}>
          <View
            style={{
              marginTop: -5,
              borderRadius: 10, // You can adjust the borderRadius as needed
              backgroundColor: 'white', // Set your desired background color
              shadowColor: 'rgb(95,99,104)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 4, // Adjust the shadow radius as needed
              elevation: 2,
            }}>
            {/* Date Time Picker */}
            <View style={{ width: '100%', }}>


              <ScrollView style={{
                marginBottom: 12, marginTop: 44,
              }}>
                <View
                  style={{
                    marginTop: -5,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    shadowColor: 'rgb(95,99,104)',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    elevation: 2,
                  }}>
                  {/* ... (previous code) */}
                  <View style={{ width: '100%', }}>
                    {/* ... (previous code) */}
                    <View style={{
                      marginTop: 8,
                    }}>
                      <Text style={{ ...FONTS.h4 }}>From Date</Text>
                      <TouchableOpacity
                        style={styles.inputBtn}
                        onPress={handleOnPressStartDate}
                      >
                        <Text>{selectedStartDate}</Text>
                      </TouchableOpacity>
                    </View>
                    {/* Create modal for date picker */}
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={openStartDatePicker}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <DatePicker
                            mode="calendar"
                            minimumDate={startDate}
                            selected={startedDate}
                            onDateChanged={handleDateChange}
                            onSelectedChange={(date) => setSelectedStartDate(date)}
                            options={{
                              backgroundColor: "#080516",
                              textHeaderColor: "#469ab6",
                              textDefaultColor: "#FFFFFF",
                              selectedTextColor: "#FFF",
                              mainColor: "#469ab6",
                              textSecondaryColor: "#FFFFFF",
                              borderColor: "rgba(122, 146, 165, 0.1)",
                            }}
                          />

                          <TouchableOpacity onPress={handleOnPressStartDate}>
                            <Text style={{ color: "white" }}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>

                    <View style={{
                      marginTop: 8,
                    }}>
                      <Text style={{ ...FONTS.h4 }}>To Date</Text>
                      <TouchableOpacity
                        style={styles.inputBtn}
                        onPress={handleOnPressEndDate}
                      >
                        <Text>{selectedEndDate}</Text>
                      </TouchableOpacity>
                    </View>
                    {/* Create modal for end date picker */}
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={openEndDatePicker}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <DatePicker
                            mode="calendar"
                            minimumDate={startDate}
                            selected={selectedEndDate}
                            onDateChanged={handleDateChangeEnd}
                            onSelectedChange={(date) => setSelectedEndDate(date)}
                            options={{
                              backgroundColor: "#080516",
                              textHeaderColor: "#469ab6",
                              textDefaultColor: "#FFFFFF",
                              selectedTextColor: "#FFF",
                              mainColor: "#469ab6",
                              textSecondaryColor: "#FFFFFF",
                              borderColor: "rgba(122, 146, 165, 0.1)",
                            }}
                          />

                          <TouchableOpacity onPress={handleOnPressEndDate}>
                            <Text style={{ color: "white" }}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>
                  {/* ... (previous code) */}
                </View>
              </ScrollView>

              {/* <View style={{ marginTop: 15 }}>
                <Text style={{ ...FONTS.h4 }}>Select Time</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={handleOnPressStartTime}
                >
                  <Text>{selectedStartTime}</Text>
                </TouchableOpacity>
              </View> */}

              {/* Create modal for time picker */}


              {/* <View >
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={openStartTimePicker}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <DatePicker
                        mode="time" // Set mode to 'time' for time selection
                        selected={startedTime}
                        onTimeChange={handleTimeChange}
                        options={{
                          backgroundColor: "#080516",
                          textHeaderColor: "#469ab6",
                          textDefaultColor: "#FFFFFF",
                          selectedTextColor: "#FFF",
                          mainColor: "#469ab6",
                          textSecondaryColor: "#FFFFFF",
                          borderColor: "rgba(122, 146, 165, 0.1)",
                        }}
                      />

                      <TouchableOpacity onPress={handleOnPressStartTime}>
                        <Text style={{ color: "white" }}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View> */}

              {/* <View style={{
                marginTop: 8,
              }}>
                <Text style={{ ...FONTS.h4 }}>Select Date</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={handleOnPressStartDate}
                >
                  <Text>{selectedStartDate}</Text>
                </TouchableOpacity>
              </View> */}
              {/* Create modal for date picker */}
              {/* <Modal
                animationType="slide"
                transparent={true}
                visible={openStartDatePicker}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <DatePicker
                      mode="calendar"
                      minimumDate={startDate}
                      selected={startedDate}
                      onDateChanged={handleDateChange}
                      onSelectedChange={(date) => setSelectedStartDate(date)}
                      options={{
                        backgroundColor: "#080516",
                        textHeaderColor: "#469ab6",
                        textDefaultColor: "#FFFFFF",
                        selectedTextColor: "#FFF",
                        mainColor: "#469ab6",
                        textSecondaryColor: "#FFFFFF",
                        borderColor: "rgba(122, 146, 165, 0.1)",
                      }}
                    />

                    <TouchableOpacity onPress={handleOnPressStartDate}>
                      <Text style={{ color: "white" }}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal> */}
            </View>


            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
                marginTop: 13,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>No of Leave Days</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                  marginTop: 6,
                  marginBottom: 15,
                }}
              >
                <TextInput
                  // value={name}
                  // // onChangeText={(value) => setName(value)}
                  // editable={true}
                  placeholder='No'
                />
              </View>
            </View>

            {/* Date Time Picker */}

            {/* <View style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center'
                  }}>
                      <Text>Leave type: {value === null ? 'none' : value}</Text>
                  </View> */}
                  

            <Text style={{ ...FONTS.h4 }}>Leave type</Text>
            
                <View style={{
                  flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 2, marginTop: 0,
                }}>
                  
                  <DropDownPicker style={{
                    height: 44,
                    width: "100%",
                    borderColor: COLORS.secondaryGray,
                    borderWidth: 1,
                    borderRadius: 4,
                    marginVertical: 6,
                    justifyContent: "center",
                    paddingLeft: 8,
                    marginTop: 6,
                    marginBottom: 27,

                  }}

                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder={'Leave type'}
                  />

                </View>

            <Text style={{ ...FONTS.h4 }}>Reason</Text>

            <View style={{
              height: 44,
              width: "100%",
              borderColor: COLORS.secondaryGray,
              borderWidth: 1,
              borderRadius: 4,
              marginVertical: 6,
              justifyContent: "center",
              paddingLeft: 8,
              height: 148,
              marginTop: 8,

            }}>
              <TextInput
                // placeholder='Reason'
                // placeholderTextColor={COLORS.black}
                // keyboardType='email-address'
                style={{
                  width: 340,
                  borderRadius: 100

                }}
              // onChangeText={(text) => setRollNo(text)} // Update RollNo state
              // value={username}
              />
            </View>


            <TouchableOpacity onPress={handleOnPressStartDate}>
              <Text style={{ color: "white" }}>Close</Text>
            </TouchableOpacity>

            {/* <Button
              title="Submit"
              filled
              style={{
                marginTop: 38,
                marginBottom: 4,
                width: '100%', borderRadius: 100, alignItems: "center",
                justifyContent: "center",

              }}
              onPress={() =>
                console.log("Submit data:", selectedStartDate, selectedStartTime)
              }
            /> */}
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                height: 44,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  ...FONTS.body3,
                  color: COLORS.white,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 36,
    marginVertical: 60,
    color: "#111",
  },
  textSubHeader: {
    fontSize: 25,
    color: "#111",
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#222",
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "center",
    marginTop: 5,
    height: 44,
    width: "100%",
    borderColor: COLORS.secondaryGray,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 6,
    justifyContent: "center",
    paddingLeft: 8,
  },
  submitBtn: {
    backgroundColor: "#342342",
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#080516",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Messages