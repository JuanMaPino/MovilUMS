import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAyudantes } from '../../../context/AyudanteContext/AyudanteContext';

export default function AyudanteDetails({ route }) {
  const { ayudante } = route.params;
  const navigation = useNavigation();
  const { deleteAyudante, disableAyudante } = useAyudantes();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ayudante.nombre}</Text>
      <Text style={styles.details}>Tipo de Documento: {ayudante.tipoDocumento}</Text>
      <Text style={styles.details}>Identificación: {ayudante.identificacion}</Text>
      <Text style={styles.details}>Teléfono: {ayudante.telefono}</Text>
      <Text style={styles.details}>Rol: {ayudante.rol}</Text>
      <Text style={styles.details}>Dirección: {ayudante.direccion}</Text>
      <Text style={styles.details}>Correo Electrónico: {ayudante.correoElectronico || 'No especificado'}</Text>
      <Text style={styles.details}>Institución: {ayudante.institucion}</Text>
      <Text style={styles.details}>Estado: {ayudante.estado}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('AyudanteForm', { ayudante })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.toggleButton]}
          onPress={handleToggleStatus}
        >
          <Text style={styles.buttonText}>
            {ayudante.estado === 'activo' ? 'Desactivar' : 'Activar'}
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