import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAyudantes } from '../../../context/AyudanteContext/AyudanteContext';
import AssignTasksModal from '../../../components/AssignTasksModal';

export default function AyudanteDetails({ route }) {
  const { ayudante } = route.params;
  const navigation = useNavigation();
  const { deleteAyudante, disableAyudante, updateAyudante } = useAyudantes();
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [currentAyudante, setCurrentAyudante] = useState(ayudante);

  useEffect(() => {
    setCurrentAyudante(ayudante);
  }, [ayudante]);

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Ayudante",
      "¿Estás seguro de que quieres eliminar este ayudante?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAyudante(ayudante._id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el ayudante");
            }
          }
        }
      ]
    );
  };

  const handleToggleStatus = async () => {
    try {
      await disableAyudante(ayudante._id);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar el estado del ayudante");
    }
  };

  const handleAyudanteUpdate = (updatedAyudante) => {
    setCurrentAyudante(updatedAyudante);
    navigation.setParams({ ayudante: updatedAyudante });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{currentAyudante.nombre}</Text>
      <Text style={styles.details}>Tipo de Documento: {currentAyudante.tipoDocumento}</Text>
      <Text style={styles.details}>Identificación: {currentAyudante.identificacion}</Text>
      <Text style={styles.details}>Teléfono: {currentAyudante.telefono}</Text>
      <Text style={styles.details}>Rol: {currentAyudante.rol}</Text>
      <Text style={styles.details}>Dirección: {currentAyudante.direccion}</Text>
      <Text style={styles.details}>Correo Electrónico: {currentAyudante.correoElectronico || 'No especificado'}</Text>
      <Text style={styles.details}>Institución: {currentAyudante.institucion}</Text>
      <Text style={styles.details}>Estado: {currentAyudante.estado}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('AyudanteForm', { ayudante: currentAyudante })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.toggleButton]}
          onPress={handleToggleStatus}
        >
          <Text style={styles.buttonText}>
            {currentAyudante.estado === 'activo' ? 'Desactivar' : 'Activar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.assignButton]}
        onPress={() => setIsAssignModalVisible(true)}
      >
        <Text style={styles.buttonText}>Asignar Tareas</Text>
      </TouchableOpacity>

      <AssignTasksModal
        visible={isAssignModalVisible}
        onClose={() => setIsAssignModalVisible(false)}
        ayudante={currentAyudante}
        onUpdate={handleAyudanteUpdate}
      />

{currentAyudante.tareasAsignadas && currentAyudante.tareasAsignadas.length > 0 && (
    <View style={styles.assignedTasksContainer}>
        <Text style={styles.assignedTasksTitle}>Tareas Asignadas:</Text>
        {currentAyudante.tareasAsignadas.map((task, index) => (
            <View key={index} style={styles.assignedTaskItem}>
                <Text style={styles.assignedTaskName}>{task.nombre || 'Tarea sin nombre'}</Text>
                <Text style={styles.assignedTaskDetails}>Horas: {task.horas}</Text>
                <Text style={styles.assignedTaskDetails}>proceso: {task.proceso}</Text>
            </View>
        ))}
    </View>
)}

    </ScrollView>
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
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
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
  assignButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  assignedTasksContainer: {
    marginTop: 20,
  },
  assignedTasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  assignedTaskItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  assignedTaskName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  assignedTaskDetails: {
    fontSize: 14,
  },
});