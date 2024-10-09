import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { TareaProvider } from "./context/TareaContext/TareaContext";
import { AyudanteProvider } from "./context/AyudanteContext/AyudanteContext";
import TaskList from "./src/Screens/ListarTareas/TaskList";
import TaskForm from "./src/Screens/FormularioTareas/TaskForm";
import TaskDetails from "./src/Screens/viewTarea/TaskDetails";
import AyudanteList from "./src/Screens/ListarAyudantes/AyudanteList";
import AyudanteForm from "./src/Screens/FormularioAyudantes/AyudantesForm";
import AyudanteDetails from "./src/Screens/viewAyudante/AyudanteDetails";
import SigninScreen from "./src/Screens/SingininScreen/SigninScreen";
import SidebarMenu from "./components/Sidebar";

enableScreens();

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function TaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskList" component={TaskList} options={{ title: "Lista de Tareas" }} />
      <Stack.Screen 
        name="TaskForm" 
        component={TaskForm} 
        options={({ route }) => ({ 
          title: route.params?.task ? "Editar Tarea" : "Nueva Tarea" 
        })}
      />
      <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ title: "Detalles de la Tarea" }} />
    </Stack.Navigator>
  );
}

function AyudanteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AyudanteList" component={AyudanteList} options={{ title: "Lista de Ayudantes" }} />
      <Stack.Screen 
        name="AyudanteForm" 
        component={AyudanteForm} 
        options={({ route }) => ({ 
          title: route.params?.ayudante ? "Editar Ayudante" : "Nuevo Ayudante" 
        })}
      />
      <Stack.Screen name="AyudanteDetails" component={AyudanteDetails} options={{ title: "Detalles del Ayudante" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TareaProvider>
        <AyudanteProvider>
          <NavigationContainer>
            <Drawer.Navigator drawerContent={props => <SidebarMenu {...props} />}>
              <Drawer.Screen name="Tareas" component={TaskStack} />
              <Drawer.Screen name="Ayudantes" component={AyudanteStack} />
              <Drawer.Screen name="Signin" component={SigninScreen} options={{ title: "Iniciar Sesión" }} />
            </Drawer.Navigator>
          </NavigationContainer>
        </AyudanteProvider>
      </TareaProvider>
    </SafeAreaProvider>
  );
}