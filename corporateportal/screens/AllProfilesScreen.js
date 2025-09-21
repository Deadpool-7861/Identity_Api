import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AllProfilesScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);

  const load = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://10.0.2.2:8000/api/identity/profiles/?context=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Profiles from API:", data);
      setProfiles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("Error fetching profiles:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      load(); // reload every time screen is focused
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Corporate Profiles
      </Text>

      <FlatList
        data={profiles}
        keyExtractor={(item) => String(item.id ?? Math.random())}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProfileDetail", {  profileId: item.id })
            }
            style={{ paddingVertical: 10 }}
          >
            <Text style={{ fontSize: 16 }}>
              {item.profile_name || "Unnamed Profile"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No profiles yet.</Text>}
      />

      <Button
        title="Create My Profile"
        onPress={() => navigation.navigate("CreateProfile")}
      />
    </View>
  );
}
