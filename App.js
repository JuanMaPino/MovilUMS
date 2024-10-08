import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Screens from "./src/Screens/SingininScreen";
enableScreens();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Screens/>
        
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
