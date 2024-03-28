import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import React, { Component, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES, images } from "../constants";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";



class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // Store the data from the API here
    };
  }

  componentDidMount = () => {
    // Fetch data from PHP API
    fetch('https://test.vfthris.com/api/getData.php')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        this.setState({ data }); // Update the state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  render() {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: COLORS.white
      }}>
        <View style={{
          marginHorizontal: 22,
          marginTop: 12
        }}>
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

            <Text style={{ ...FONTS.h3 }}>Manage Leave</Text>
          </View>

          {/* <ScrollView> */}
          <View >


            {/* <FlatList
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
              />

              <FlatList
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

            <View style={{
              marginHorizontal: 12,
              marginVertical: SIZES.padding,
            }}>
              <FlatList
                data={this.state.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={{
                    backgroundColor: COLORS.white,
                    borderRadius: 20,
                    marginTop: SIZES.padding,
                    width: SIZES.width - 67,
                    marginTop: 20,
                    height: 120,
                    marginRight: 50,
                    shadowColor: 'rgb(95,99,104)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1, // Adjust the shadow radius as needed
                    elevation:1,
                    // borderRadius: 85,
                    borderWidth: 2,
                    borderColor: COLORS.gray,
                    // backgroundColor: COLORS.white,
                  }}>
                    <Text style={{
                      fontSize: 14,
                      marginVertical: SIZES.padding * 2, marginLeft: 15, color: "#a1a1a5",
                    }}>1 Day Application</Text>
                    <Text style={{
                      fontSize: 21,
                      marginVertical: SIZES.padding * 2, fontWeight: "bold", marginTop: -15, marginLeft: 15
                    }}>Wed, 16 Dec</Text>
                    <Text style={{
                      fontSize: 16,
                      marginVertical: SIZES.padding * 2, fontWeight: "bold", marginTop: -15, marginLeft: 15, color: "#ffbe1b",
                    }}>Casual</Text>
                    <View style={{
                      backgroundColor: "#b5f5d1",
                      width: 100,
                      height: 25,
                      marginTop: -95,
                      marginLeft:220,
                      borderRadius:8,
                    }}>
                      <Text style={{
                        marginLeft:20,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop:3,
                        fontWeight:"bold",
                        color:"#409a54",
                      }}>Approved</Text>
                    </View>


                    {/* <View style={{
                      backgroundColor: "#ffefc4",
                      width: 100,
                      height: 25,
                      marginTop: -95,
                      marginLeft:220,
                      borderRadius:8,
                    }}>
                      <Text style={{
                        marginLeft:20,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop:3,
                        fontWeight:"bold",
                        color:"#c28c07",
                      }}>Awaiting</Text>
                    </View> */}

                    {/* <View style={{
                      backgroundColor: "#ffefee",
                      width: 100,
                      height: 25,
                      marginTop: -95,
                      marginLeft:220,
                      borderRadius:8,
                    }}>
                      <Text style={{
                        marginLeft:20,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop:3,
                        fontWeight:"bold",
                        color:"#ff8f8f",
                      }}>Declined</Text>
                    </View> */}
                    {/* <Text style={{ marginLeft: 20, }}>RollNo: {item.username}</Text>
                    <Text style={{ marginLeft: 20, marginRight: 50 }}>RollNo: {item.password}</Text> */}

                    {/* <Text style={styles.TextDesign}>Student Name: {item.Emp_Full_Name}</Text>
                                  <Text style={styles.TextDesign}>Courses: {item.Course}</Text> */}

                  </View>
                )}
              />


            </View>
            {/* </ScrollView> */}
          </View>

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
          {/* </ScrollView> */}
        </View>
      </SafeAreaView >
    );
  };
}
export default Profile;
