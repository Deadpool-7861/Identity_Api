import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfilesScreen from "./screens/ProfilesScreen";
import ProfileDetailScreen from "./screens/ProfileDetailScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";
import AllProfilesScreen from "./screens/AllProfilesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="AllProfiles" component={AllProfilesScreen} />
        <Stack.Screen name="Profiles" component={ProfilesScreen} />
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
