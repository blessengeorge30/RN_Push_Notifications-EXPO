import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [selectedItems, setSelectedItems] = useState(1);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        setPermissionsGranted(finalStatus === "granted");
      } else {
        console.log("Must use a physical device for Push Notifications");
      }
    };

    requestPermissions();
  }, []);

  const addToCart = async () => {
    if (!permissionsGranted) {
      console.log("Notifications not granted. Please enable them in settings.");
      return;
    }

    // Schedule a notification 30 seconds from now using a date trigger
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Cart Reminder",
        body: `${selectedItems} item(s) have been in your cart. Please proceed to checkout.`,
        sound: "default",
      },
      trigger: { seconds: 30 },
    });

    console.log("Notification scheduled!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart Notification App</Text>
      <Text style={styles.label}>Select Number of Items:</Text>
      <Picker
        selectedValue={selectedItems}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedItems(itemValue)}
      >
        {[...Array(10)].map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={addToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    width: 200,
    height: 50,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
