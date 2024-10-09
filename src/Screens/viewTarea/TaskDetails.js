import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTareas } from '../../../context/TareaContext/TareaContext';

export default function TaskDetails({ route }) {
  const { task } = route.params;
  const navigation = useNavigation();
  const { deleteTarea, disableTarea } = useTareas();

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Tarea",
      "¿Estás seguro de que quieres eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTarea(task._id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la tarea");
            }
          }
        }
      ]
    );
  };

  const handleToggleStatus = async () => {
    try {
      await disableTarea(task._id);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar el estado de la tarea");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.nombre}</Text>
      <Text style={styles.description}>{task.accion}</Text>
      <Text style={styles.details}>Horas: {task.cantidadHoras}</Text>
      <Text style={styles.details}>Estado: {task.estado}</Text>
      <Text style={styles.details}>Proceso: {task.proceso}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('TaskForm', { task })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.toggleButton]}
          onPress={handleToggleStatus}
        >
          <Text style={styles.buttonText}>
            {task.estado === 'activo' ? 'Desactivar' : 'Activar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  toggleButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});