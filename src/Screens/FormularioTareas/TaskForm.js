import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTareas } from '../../../context/TareaContext/TareaContext';

export default function TaskForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { createTarea, updateTarea } = useTareas();
  const [formData, setFormData] = useState({
    nombre: '',
    accion: '',
    cantidadHoras: '',
    estado: 'activo'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (route.params?.task) {
      const { nombre, accion, cantidadHoras, estado } = route.params.task;
      setFormData({
        nombre: nombre || '',
        accion: accion || '',
        cantidadHoras: cantidadHoras ? cantidadHoras.toString() : '',
        estado: estado || 'activo'
      });
    }
  }, [route.params?.task]);

  const handleChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'nombre':
        errorMessage = !value ? 'Este campo es obligatorio' : !/^[a-zA-Z\s]+$/.test(value) ? 'El nombre solo debe contener letras y espacios' : '';
        break;
      case 'accion':
        errorMessage = !value ? 'Este campo es obligatorio' : '';
        break;
      case 'cantidadHoras':
        errorMessage = !value ? 'Este campo es obligatorio' : isNaN(value) ? 'La cantidad de horas debe ser un número' : parseInt(value) < 1 ? 'La cantidad de horas debe ser al menos 1' : parseInt(value) > 12 ? 'La cantidad de horas no debe ser más de 12' : '';
        break;
      default:
        break;
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleSubmit = async () => {
    const formIsValid = Object.keys(formData).every(key => {
      validateField(key, formData[key]);
      return !errors[key];
    });

    if (formIsValid) {
      try {
        const dataToSend = {
          ...formData,
          cantidadHoras: parseInt(formData.cantidadHoras, 10)
        };

        if (route.params?.task) {
          await updateTarea(route.params.task._id, dataToSend);
          Alert.alert('Éxito', 'Tarea actualizada correctamente.');
        } else {
          await createTarea(dataToSend);
          Alert.alert('Éxito', 'Tarea creada correctamente.');
        }
        navigation.goBack();
      } catch (error) {
        console.error('Error saving task:', error);
        Alert.alert('Error', error.response?.data?.error || 'Error al guardar la tarea.');
      }
    } else {
      Alert.alert('Error', 'Por favor, corrige los errores en el formulario.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.nombre && styles.inputError]}
            value={formData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
            placeholder="Nombre de la tarea"
          />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Acción <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.accion && styles.inputError]}
            value={formData.accion}
            onChangeText={(text) => handleChange('accion', text)}
            placeholder="Acción a realizar"
          />
          {errors.accion && <Text style={styles.errorText}>{errors.accion}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cantidad de Horas <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.cantidadHoras && styles.inputError]}
            value={formData.cantidadHoras}
            onChangeText={(text) => handleChange('cantidadHoras', text)}
            placeholder="Cantidad de horas"
            keyboardType="numeric"
          />
          {errors.cantidadHoras && <Text style={styles.errorText}>{errors.cantidadHoras}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {route.params?.task ? 'Actualizar Tarea' : 'Agregar Tarea'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4e54c8',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
