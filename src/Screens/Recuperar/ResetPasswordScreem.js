import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Logo from '../../assets/images/logoums.png';
import bosque from '../../assets/images/bosquesito.jpeg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButton } from '../../components';
import { FontAwesome } from '@expo/vector-icons'; // Para usar iconos como los de RiEyeLine

const ResetPasswordScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    code: ['', '', '', '', '', ''],
    newPassword: '',
  });
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCodeChange = (value, index) => {
    const newCode = [...formData.code];
    newCode[index] = value;
    setFormData({ ...formData, code: newCode });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      if (step === 1) {
        const response = await axios.post('YOUR_API_URL/send-recovery-code', {
          email: formData.usernameOrEmail,
        });
        setUserId(response.data.usuario._id);
        setStep(2);
      } else if (step === 2) {
        const code = formData.code.join('');
        await axios.post('YOUR_API_URL/validate-recovery-code', {
          userId,
          code,
        });
        setStep(3);
      } else if (step === 3) {
        await axios.post('YOUR_API_URL/change-password', {
          userId,
          newPassword: formData.newPassword,
        });
        setMessage('Contraseña cambiada exitosamente. Redirigiendo al login...');
        setTimeout(() => navigation.navigate('Login'), 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error en el proceso de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.container}>
      <Image source={bosque} style={styles.backgroundImage} />
      <View style={styles.content}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>
          {step === 1
            ? 'Recuperar Contraseña'
            : step === 2
            ? 'Ingresar Código'
            : 'Nueva Contraseña'}
        </Text>

        {step === 1 && (
          <TextInput
            style={styles.input}
            placeholder="Usuario o Email"
            value={formData.usernameOrEmail}
            onChangeText={(value) => handleChange('usernameOrEmail', value)}
          />
        )}

        {step === 2 && (
          <View style={styles.codeInputContainer}>
            {formData.code.map((value, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                value={value}
                maxLength={1}
                onChangeText={(text) => handleCodeChange(text, index)}
                keyboardType="numeric"
              />
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nueva Contraseña"
              secureTextEntry={!passwordVisible}
              value={formData.newPassword}
              onChangeText={(value) => handleChange('newPassword', value)}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={togglePasswordVisibility}
            >
              <FontAwesome
                name={passwordVisible ? 'eye' : 'eye-slash'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        )}

        <CustomButton
          text={loading ? <ActivityIndicator /> : 'Continuar'}
          onPress={handleSubmit}
          disabled={loading}
        />

        {message ? <Text style={styles.errorMessage}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    borderRadius: 5,
    margin: 5,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default ResetPasswordScreen;
