import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAyudantes } from '../../../context/AyudanteContext/AyudanteContext';

export default function AyudanteForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { createAyudante, updateAyudante } = useAyudantes();
  const [formData, setFormData] = useState({
    tipoDocumento: 'C.C',
    identificacion: '',
    nombre: '',
    telefono: '',
    rol: 'alfabetizador',
    direccion: '',
    correoElectronico: '',
    institucion: '',
    estado: 'activo'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (route.params?.ayudante) {
      const { tipoDocumento, identificacion, nombre, telefono, rol, direccion, correoElectronico, institucion, estado } = route.params.ayudante;
      setFormData({
        tipoDocumento: tipoDocumento || 'C.C',
        identificacion: identificacion || '',
        nombre: nombre || '',
        telefono: telefono || '',
        rol: rol || 'alfabetizador',
        direccion: direccion || '',
        correoElectronico: correoElectronico || '',
        institucion: institucion || '',
        estado: estado || 'activo'
      });
    }
  }, [route.params?.ayudante]);

  const handleChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'identificacion':
        errorMessage = !value ? 'Este campo es obligatorio' : !/^\d{8,10}$/.test(value) ? 'El documento debe contener entre 8 y 10 dígitos' : '';
        break;
      case 'nombre':
        errorMessage = !value ? 'Este campo es obligatorio' : !/^[a-zA-Z\s]+$/.test(value) ? 'El nombre solo debe contener letras y espacios' : '';
        break;
      case 'telefono':
        errorMessage = !value ? 'Este campo es obligatorio' : value.toString().length !== 10 ? 'El teléfono debe tener 10 dígitos' : '';
        break;
      case 'correoElectronico':
        errorMessage = value && !/.+@.+\..+/.test(value) ? 'Ingrese un correo electrónico válido' : '';
        break;
      case 'direccion':
        errorMessage = !value ? 'Este campo es obligatorio' : value.length < 5 ? 'La dirección debe tener al menos 5 caracteres' : '';
        break;
      case 'institucion':
        errorMessage = !value ? 'Este campo es obligatorio' : value.length < 5 ? 'La institución debe tener al menos 5 caracteres' : '';
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
        if (route.params?.ayudante) {
          await updateAyudante(route.params.ayudante._id, formData);
          Alert.alert('Éxito', 'Ayudante actualizado correctamente.');
        } else {
          await createAyudante(formData);
          Alert.alert('Éxito', 'Ayudante creado correctamente.');
        }
        navigation.goBack();
      } catch (error) {
        console.error('Error saving ayudante:', error);
        Alert.alert('Error', error.response?.data?.error || 'Error al guardar el ayudante.');
      }
    } else {
      Alert.alert('Error', 'Por favor, corrige los errores en el formulario.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Documento</Text>
          <TextInput
            style={styles.input}
            value={formData.tipoDocumento}
            onChangeText={(text) => handleChange('tipoDocumento', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Identificación <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.identificacion && styles.inputError]}
            value={formData.identificacion}
            onChangeText={(text) => handleChange('identificacion', text)}
            placeholder="Número de identificación"
          />
          {errors.identificacion && <Text style={styles.errorText}>{errors.identificacion}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.nombre && styles.inputError]}
            value={formData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
            placeholder="Nombre del ayudante"
          />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.telefono && styles.inputError]}
            value={formData.telefono}
            onChangeText={(text) => handleChange('telefono', text)}
            placeholder="Teléfono del ayudante"
            keyboardType="numeric"
          />
          {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rol <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={formData.rol}
            onChangeText={(text) => handleChange('rol', text)}
            placeholder="Rol del ayudante"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dirección <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.direccion && styles.inputError]}
            value={formData.direccion}
            onChangeText={(text) => handleChange('direccion', text)}
            placeholder="Dirección del ayudante"
          />
          {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, errors.correoElectronico && styles.inputError]}
            value={formData.correoElectronico}
            onChangeText={(text) => handleChange('correoElectronico', text)}
            placeholder="Correo electrónico"
            keyboardType="email-address"
          />
          {errors.correoElectronico && <Text style={styles.errorText}>{errors.correoElectronico}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Institución <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.institucion && styles.inputError]}
            value={formData.institucion}
            onChangeText={(text) => handleChange('institucion', text)}
            placeholder="Institución del ayudante"
          />
          {errors.institucion && <Text style={styles.errorText}>{errors.institucion}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {route.params?.ayudante ? 'Actualizar Ayudante' : 'Agregar Ayudante'}
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
