import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const urlBase = 'http://192.168.100.21:8080';

  const funcionalidades = [
    'Bíblia Sagrada',
    'Liturgia Diária',
    'Liturgia Eucarística',
    'Celebração da Palavra',
    'Santo do Dia',
    'Meditação',
    'Anotações',
  ];

  const handleFuncionalidade = async (nome: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token não encontrado');

      if (nome === 'Bíblia Sagrada') {
        const response = await fetch(urlBase + '/hello', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || 'Erro ao conectar com a API');
        }

        const message = await response.text();
        router.push({
          pathname: '/screens/biblia',
          params: { message },
        });

      } else if (nome === 'Anotações') {
        const response = await fetch(`${urlBase}/anotacoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || 'Erro ao buscar anotações');
        }

        const anotacoes = await response.json();

        router.push({
          pathname: '/screens/anotacoes/anotacoes',
          params: { data: JSON.stringify(anotacoes) }, 
        });

      } else {
        const mensagem = `Você selecionou: ${nome}`;
        Platform.OS === 'web'
          ? window.alert(mensagem)
          : Alert.alert('Funcionalidade', mensagem);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro inesperado');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/símbolos católicos.jpg')}
          style={styles.image}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="imagem de Uma cruz de madeira centralizada, com um cálice dourado à esquerda e uma Bíblia marrom à direita, acompanhada de duas hóstias brancas. Ao redor da cruz, há ramos verdes formando uma coroa. No fundo, há um círculo amarelo com raios que emanam do centro. Na parte inferior, há uma faixa amarela em branco"

        />
        <Text style={styles.title}>Devout Catholic</Text>
      </View>

      <Text style={styles.subtitle}>Sou católico, pratíco minha fé!</Text>

      <View style={styles.buttonList}>
        {funcionalidades.map((item) => (
          <View key={item} style={styles.buttonContainer}>
            <Button
              title={item}
              color="#1e90ff"
              onPress={() => handleFuncionalidade(item)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A',
    flex: 1,
    flexWrap: 'wrap',
  },
  image: {
    width: 120,
    height: 120,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    alignSelf: 'flex-start',
  },
  buttonList: {
    width: '100%',
  },
  buttonContainer: {
    marginBottom: 15,
  },
});
