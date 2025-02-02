import { View, Text, Platform } from "react-native";
import React from "react";
import {
  SimpleLineIcons,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../constants";
import { Create, Home, Messages, Profile, Settings } from "../screens";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    // height: 60,
    backgroundColor: COLORS.white,
  },
};
const BottomTabNav = () => {
  return (
    // <Tab.Navigator screenOptions={screenOptions}>
    //   <Tab.Screen
    //     name="Home"
    //     component={Home}
    //     options={{
    //       tabBarIcon: ({ focused }) => {
    //         return (
    //           <SimpleLineIcons
    //             name="home"
    //             size={24}
    //             color={focused ? COLORS.primary : COLORS.black}
    //           />
    //         );
    //       },
    //     }}
    //   />
       <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                size={30}
                color={focused ? COLORS.primary : COLORS.black}
    />
            )
          }
        }}
      />

      {/* <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <MaterialCommunityIcons
                name="message-text-outline"
                size={24}
                color={focused ? COLORS.primary : COLORS.black}
              />
            );
          },
        }}
      /> */}
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-clock' : 'account-clock-outline'} // Use different icons for focused and non-focused states
              size={28}
                color={focused ? COLORS.primary : COLORS.black}
    />
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLORS.primary,
                  height: Platform.OS == "ios" ? 50 : 60,
                  width: Platform.OS == "ios" ? 50 : 60,
                  top: Platform.OS == "ios" ? -10 : -20,
                  borderRadius: Platform.OS == "ios" ? 25 : 30,
                  borderWidth: 2,
                  borderColor: COLORS.white,
                }}
              >
                <Fontisto name="plus-a" size={28} color={COLORS.white} />
              </View>
            );
          },
        }}
      />
      {/* <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <MaterialIcons
                name="person-outline"
                size={24}
                color={focused ? COLORS.primary : COLORS.black}
              />
            );
          },
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              // name="event-note"
              name={focused ? 'badge-account-horizontal' : 'badge-account-horizontal-outline'} // Use different icons for focused and non-focused states
              size={28}
                color={focused ? COLORS.primary : COLORS.black}
                style={{marginTop:-1}}
              // Customize the color as needed
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <MaterialIcons
                name="apps"
                size={30}
                color={focused ? COLORS.primary : COLORS.black}
                style={{marginTop:1}}
              />
            );
          },
        }}
      />
      {/* <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              // name="event-note"
              name={focused ? 'badge-account-horizontal' : 'badge-account-horizontal-outline'} // Use different icons for focused and non-focused states
              size={30}
              color={focused ? COLORS.black : COLORS.black} // Customize the color as needed
            />
          ),
        }}
      /> */}

    </Tab.Navigator>
  );
};

export default BottomTabNav;
