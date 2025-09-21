import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import axios from "axios";

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleSignup = async () => {
    try {
      await axios.post("http://10.0.2.2:8000/api/identity/signup/", {
        username,
        email,
        password,
        role,
      });
      alert("Signup successful! Please login.");
      navigation.goBack();
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Signup</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <TextInput placeholder="Role (boss/employee)" onChangeText={setRole} value={role} />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}
