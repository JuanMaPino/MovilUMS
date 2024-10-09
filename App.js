import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Screens from "./src/Screens/SingininScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { TareaProvider } from "./context/TareaContext/TareaContext";
import TaskList from "./src/Screens/ListarTareas/TaskList";
import TaskForm from "./src/Screens/ListarTareas/TaskList";
import TaskDetails from "./src/Screens/viewTarea/TaskDetails";
import SigninScreen from "./src/Screens/SingininScreen/SigninScreen";
enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <TareaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="TaskList">
            <Stack.Screen 
              name="TaskList" 
              component={TaskList} 
              options={{ title: "Lista de Tareas" }}
            />
            <Stack.Screen 
              name="TaskForm" 
              component={TaskForm} 
              options={({ route }) => ({ 
                title: route.params?.task ? "Editar Tarea" : "Nueva Tarea" 
              })}
            />
            <Stack.Screen 
              name="TaskDetails" 
              component={TaskDetails} 
              options={{ title: "Detalles de la Tarea" }}
            />
            <Stack.Screen 
              name="Signin" 
              component={SigninScreen} 
              options={{ title: "Iniciar Sesión" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TareaProvider>
    </SafeAreaProvider>
  );
}