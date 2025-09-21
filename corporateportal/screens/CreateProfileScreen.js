// import React, { useState } from "react";
// import { View, TextInput, Button } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
//
// export default function CreateProfileScreen({ navigation }) {
//   const [profileName, setProfileName] = useState("");
//   const [description, setDescription] = useState("");
//
//   const handleCreate = async () => {
//     const token = await AsyncStorage.getItem("token");
//     await axios.post("http://10.0.2.2:8000/api/identity/profiles/", {
//       context: 1,
//       profile_name: profileName,
//       description,
//     }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     navigation.goBack();
//   };
//
//   return (
//     <View>
//       <TextInput placeholder="Profile Name" value={profileName} onChangeText={setProfileName} />
//       <TextInput placeholder="Description" value={description} onChangeText={setDescription} />
//       <Button title="Create" onPress={handleCreate} />
//     </View>
//   );
// }



import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateProfileScreen({ navigation }) {
  const [profileName, setProfileName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in first.");
        return;
      }

      const res = await fetch("http://10.0.2.2:8000/api/identity/profiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          context: 1, // Corporate context
          profile_name: profileName,
          description: description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error creating profile:", errorData);
        Alert.alert("Error", "Failed to create profile.");
        return;
      }

      const data = await res.json();
      console.log("Profile created:", data);
      Alert.alert("Success", "Profile created successfully!");
      navigation.goBack();
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Profile Name"
        value={profileName}
        onChangeText={setProfileName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Create Profile" onPress={handleCreate} />
    </View>
  );
}
