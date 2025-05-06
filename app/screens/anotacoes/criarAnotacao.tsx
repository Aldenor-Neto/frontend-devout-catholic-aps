import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function CriarAnotacao() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const router = useRouter();

  const handleSalvar = async () => {
    if (!titulo.trim() || !descricao.trim()) {
      const msg = 'Título e descrição são obrigatórios.';
      Platform.OS === 'web'
        ? window.alert(msg)
        : Alert.alert('Erro', msg);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      const response = await fetch('http://192.168.100.21:8080/anotacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar a anotação.');
      }

      const msg = `Anotação criada com sucesso:\nTítulo: ${titulo}`;
      Platform.OS === 'web'
        ? window.alert(msg)
        : Alert.alert('Sucesso', msg);


      setTitulo('');
      setDescricao('');

      router.replace('/screens/anotacoes/anotacoes');
    } catch (error: any) {
      const msg = error.message || 'Erro inesperado ao salvar a anotação.';
      Platform.OS === 'web'
        ? window.alert(msg)
        : Alert.alert('Erro', msg);
    }
  };

  const handleCancelar = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Tem certeza que deseja cancelar? Todos os campos serão apagados.');
      if (confirm) {
        setTitulo('');
        setDescricao('');
        router.replace('/screens/anotacoes/anotacoes');
      }
    } else {
      Alert.alert(
        'Cancelar',
        'Tem certeza que deseja cancelar? Todos os campos serão apagados.',
        [
          { text: 'Não' },
          {
            text: 'Sim',
            onPress: () => {
              setTitulo('');
              setDescricao('');
              router.replace('/screens/anotacoes/anotacoes');
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Anotação</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#666"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição"
        placeholderTextColor="#666"
        value={descricao}
        onChangeText={setDescricao}
        multiline={true}
      />

      <View style={styles.buttonContainer}>
        <Button title="Salvar" onPress={handleSalvar} color="#1e90ff" />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cancelar" onPress={handleCancelar} color="#f44336" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4A4A4A',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    marginTop: 10,
  },
});
