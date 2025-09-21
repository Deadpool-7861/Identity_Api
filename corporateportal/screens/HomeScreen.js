import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { getUsers } from "../api";

export default function HomeScreen({ route, navigation }) {
  const { token } = route.params;
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers(token);
      setUsers(data);
      // assuming your API returns the logged-in user as part of /users/
      // if not, you can add a /me/ endpoint later
      setCurrentUser(data.find(u => u.id === data[0]?.id));
    };
    fetchUsers();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {currentUser && (
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Welcome, {currentUser.username} ({currentUser.role})
        </Text>
      )}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", { token, userId: item.id })
            }
          >
            <Text style={{ fontSize: 16, marginVertical: 5 }}>
              {item.username}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
