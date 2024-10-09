import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAyudantes } from '../../../context/AyudanteContext/AyudanteContext';

export default function AyudanteList() {
  const navigation = useNavigation();
  const { ayudantes, getAllAyudantes, loading, error } = useAyudantes();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAllAyudantes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllAyudantes();
    setRefreshing(false);
  };

  const renderAyudante = ({ item }) => (
    <TouchableOpacity
      style={styles.ayudanteItem}
      onPress={() => navigation.navigate('AyudanteDetails', { ayudante: item })}
    >
      <View>
        <Text style={styles.ayudanteName}>{item.nombre}</Text>
        <Text style={styles.ayudanteInfo}>{item.telefono}</Text>
      </View>
      <View style={[styles.statusIndicator, { backgroundColor: item.estado === 'activo' ? '#4CAF50' : '#F44336' }]} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ayudantes}
        renderItem={renderAyudante}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No hay ayudantes disponibles</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AyudanteForm')}
      >
        <Text style={styles.addButtonText}>Agregar Ayudante</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayudanteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  ayudanteName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ayudanteInfo: {
    fontSize: 14,
    color: '#666',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
