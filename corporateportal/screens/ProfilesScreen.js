import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ProfilesScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://10.0.2.2:8000/api/identity/profiles/?context=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // const data = await res.json();
      // console.log("Profiles from API:", data);
      setProfiles(res.data);
    };
    fetchProfiles();
  }, []);

  return (
    <View>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ProfileDetail", { userId: item.user })}>
            <Text>{item.profile_name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Create Profile" onPress={() => navigation.navigate("CreateProfile")} />
    </View>
  );
}
