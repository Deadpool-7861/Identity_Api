import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileDetailScreen({ route, navigation }) {
  const { profileId } = route.params;
  const [profile, setProfile] = useState(null);
  const [keyName, setKeyName] = useState("");
  const [value, setValue] = useState("");
  const [isSensitive, setIsSensitive] = useState(false);

  // Fetch profile details
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`http://10.0.2.2:8000/api/identity/profile/${profileId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  // Add new attribute
  const addAttribute = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://10.0.2.2:8000/api/identity/attributes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile: profile.profile_id, // backend expects profile id
          key: keyName,
          value: value,
          is_sensitive: isSensitive,
        }),
      });

      const data = await res.json();
      console.log("Created attribute:", data);

      // Refresh profile to reload attributes
      fetchProfile();

      // Clear form
      setKeyName("");
      setValue("");
      setIsSensitive(false);
    } catch (err) {
      console.log("Error creating attribute:", err);
    }
  };

  // Delete profile
  const deleteProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`http://10.0.2.2:8000/api/identity/profiles/${profileId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        Alert.alert("Success", "Profile deleted successfully");
        navigation.goBack(); // go back to profiles list
      } else {
        const error = await res.json();
        Alert.alert("Error", JSON.stringify(error));
      }
    } catch (err) {
      console.log("Error deleting profile:", err);
      Alert.alert("Error", "Failed to delete profile");
    }
  };

  if (!profile) return <Text>Loading profile...</Text>;

  return (
    <View style={{ padding: 20 }}>
      {/* Profile Details */}
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{profile.profile_name}</Text>
      <Text>{profile.description || "No description"}</Text>

      {/* Attributes Section */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Attributes</Text>
      {profile.attributes && profile.attributes.length > 0 ? (
        profile.attributes.map((attr, idx) => (
          <Text key={idx} style={{ marginVertical: 2 }}>
            {attr.key}: {attr.value}
          </Text>
        ))
      ) : (
        <Text>No attributes yet.</Text>
      )}

      {/* Add Attribute Form */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Add Attribute</Text>
      <TextInput
        placeholder="Key (e.g. job_title)"
        value={keyName}
        onChangeText={setKeyName}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <TextInput
        placeholder="Value (e.g. Software Engineer)"
        value={value}
        onChangeText={setValue}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <Button
        title={isSensitive ? "Sensitive: ON" : "Sensitive: OFF"}
        onPress={() => setIsSensitive(!isSensitive)}
      />
      <Button title="Add Attribute" onPress={addAttribute} />

      {/* Delete Profile Button */}
      <View style={{ marginTop: 30 }}>
        <Button title="Delete Profile" color="red" onPress={deleteProfile} />
      </View>
    </View>
  );
}
