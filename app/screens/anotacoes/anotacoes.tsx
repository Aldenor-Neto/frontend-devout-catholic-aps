import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Anotacao {
  id: number;
  titulo: string;
  descricao: string;
  dataCriacao: string;
}

export default function Anotacoes() {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const router = useRouter();
  const urlBase = 'http://192.168.100.21:8080';

  useEffect(() => {
    const fetchAnotacoes = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch(`${urlBase}/anotacoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || 'Erro ao buscar anotações');
        }

        const data = await response.json();
        setAnotacoes(data);
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Erro inesperado');
      }
    };

    fetchAnotacoes();
  }, []);

  const handleVisualizar = (anotacao: Anotacao) => {
    router.push({
      pathname: '/screens/anotacoes/exibirAnotacoes',
      params: {
        titulo: anotacao.titulo,
        descricao: anotacao.descricao,
        dataCriacao: anotacao.dataCriacao,
      },
    });
  };

  const handleEditar = (id: number) => {
    router.push({
      pathname: '/screens/anotacoes/editarAnotacoes',
      params: { id },
    });
  };
  
  const handleExcluir = (id: number) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Deseja excluir a anotação? Essa ação não poderá ser desfeita!');
      if (!confirm) return;
  
      excluirAnotacao(id);
    } else {
      Alert.alert(
        'Confirmar Exclusão',
        'Deseja excluir a anotação? Essa ação não poderá ser desfeita!',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'OK',
            onPress: () => excluirAnotacao(id),
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    }
  };
  
  const excluirAnotacao = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token não encontrado');
  
      const response = await fetch(`${urlBase}/anotacoes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Erro ao excluir anotação');
      }
  
      setAnotacoes(prev => prev.filter(anotacao => anotacao.id !== id));
  
      if (Platform.OS === 'web') {
        alert('Anotação excluída com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Anotação excluída com sucesso!');
      }
    } catch (error: any) {
      if (Platform.OS === 'web') {
        alert(error.message || 'Erro inesperado');
      } else {
        Alert.alert('Erro', error.message || 'Erro inesperado');
      }
    }
  };
  
  const handleCriarNota = () => {
    router.push('/screens/anotacoes/criarAnotacao');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/símbolos católicos.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Devout Catholic</Text>
      </View>

      <Text style={styles.subtitle}>Minhas Anotações</Text>

      <ScrollView style={styles.scrollArea}>
        {anotacoes.map((anotacao) => (
          <View key={anotacao.id} style={styles.anotacaoContainer}>
            <Text style={styles.anotacaoTitulo}>{anotacao.titulo}</Text>
            <View style={styles.botoesContainer}>
              <View >
                <Button
                  title="Visualizar"
                  onPress={() => handleVisualizar(anotacao)}
                  color="#1e90ff"
                />
              </View>
              <View >
                <Button
                  title="Editar"
                  onPress={() => handleEditar(anotacao.id)}
                  color="#ffa500"
                />
              </View>
              <View >
                <Button
                  title="Excluir"
                  onPress={() => handleExcluir(anotacao.id)}
                  color="#ff4d4d"
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.rodape}>
        <Button title="Criar Nota" color="#1e90ff" onPress={handleCriarNota} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  scrollArea: {
    flex: 1,
    marginBottom: 20,
  },
  anotacaoContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  anotacaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    backgroundColor: '#1e90ff',
    padding: 8,
    borderRadius: 5,
  },
  botaoDelete: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 5,
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  rodape: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});
