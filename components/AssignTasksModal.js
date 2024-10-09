import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTareas } from '../context/TareaContext/TareaContext';
import { useAyudantes } from '../context/AyudanteContext/AyudanteContext';

const AssignTasksModal = ({ visible, onClose, ayudante, onUpdate }) => {
  const { tareas, fetchTareas } = useTareas();
  const { updateAyudante } = useAyudantes();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchTareas();
    } catch (err) {
      setError('Error al cargar las tareas. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchTareas]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tareas.length > 0 && ayudante.tareasAsignadas) {
      const assigned = ayudante.tareasAsignadas.map(assignedTask => {
        const fullTask = tareas.find(t => t._id === assignedTask.tarea);
        return fullTask
          ? { ...assignedTask, tarea: fullTask }
          : { ...assignedTask, tarea: { _id: assignedTask.tarea, nombre: 'Tarea no encontrada' } };
      });
      setAssignedTasks(assigned);
      
      const available = tareas.filter(task => 
        !assigned.some(assignedTask => assignedTask.tarea._id === task._id)
      );
      setAvailableTasks(available);
    }
  }, [tareas, ayudante.tareasAsignadas]);

  const handleAssignTask = useCallback((task) => {
    setAssignedTasks(prev => [...prev, { tarea: task, horas: task.cantidadHoras, estado: 'Creada' }]);
    setAvailableTasks(prev => prev.filter(t => t._id !== task._id));
  }, []);

  const handleRemoveTask = useCallback((taskId) => {
    setAssignedTasks(prev => {
      const removedTask = prev.find(t => t.tarea._id === taskId);
      if (removedTask) {
        setAvailableTasks(available => [...available, removedTask.tarea]);
      }
      return prev.filter(t => t.tarea._id !== taskId);
    });
  }, []);

  const handleUpdateStatus = useCallback((taskId, newStatus) => {
    setAssignedTasks(prev => 
      prev.map(t => t.tarea._id === taskId ? { ...t, estado: newStatus } : t)
    );
  }, []);

  const handleSave = async () => {
    try {
      const updatedAyudante = {
        ...ayudante,
        tareasAsignadas: assignedTasks.map(t => ({
          tarea: t.tarea._id,
          horas: t.horas,
          estado: t.estado
        })),
      };

      await updateAyudante(ayudante._id, updatedAyudante);
      onUpdate(updatedAyudante);
      onClose();
    } catch (err) {
      setError('Error al guardar los cambios. Por favor, intente de nuevo.');
    }
  };

  const totalHours = assignedTasks.reduce((total, task) => total + task.horas, 0);

  const renderAvailableTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.nombre}</Text>
      <Text style={styles.taskDescription}>{item.accion}</Text>
      <Text style={styles.taskHours}>{item.cantidadHoras} horas</Text>
      <TouchableOpacity
        style={styles.assignButton}
        onPress={() => handleAssignTask(item)}
      >
        <Text style={styles.buttonText}>Asignar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAssignedTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.tarea.nombre}</Text>
      <Text style={styles.taskHours}>{item.horas} horas</Text>
      <Picker
        selectedValue={item.estado}
        style={styles.statusPicker}
        onValueChange={(itemValue) => handleUpdateStatus(item.tarea._id, itemValue)}
      >
        <Picker.Item label="Creada" value="Creada" />
        <Picker.Item label="En proceso" value="En proceso" />
        <Picker.Item label="Finalizada" value="Finalizada" />
      </Picker>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveTask(item.tarea._id)}
      >
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Asignar Tareas a {ayudante.nombre}</Text>
          
          <Text style={styles.sectionTitle}>Tareas Disponibles</Text>
          <FlatList
            data={availableTasks}
            renderItem={renderAvailableTask}
            keyExtractor={item => item._id}
            style={styles.list}
          />

          <Text style={styles.sectionTitle}>Tareas Asignadas</Text>
          <FlatList
            data={assignedTasks}
            renderItem={renderAssignedTask}
            keyExtractor={item => item.tarea._id}
            style={styles.list}
          />

          <Text style={styles.totalHours}>Total de Horas: {totalHours}</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  list: {
    width: '100%',
    maxHeight: 200,
  },
  taskItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
  },
  taskHours: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  statusPicker: {
    height: 50,
    width: '100%',
  },
  assignButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  totalHours: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
});

export default AssignTasksModal;