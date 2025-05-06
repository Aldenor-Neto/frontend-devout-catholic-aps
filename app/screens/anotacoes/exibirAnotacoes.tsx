import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ExibirAnotacoes() {
  const { titulo, descricao, dataCriacao } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Cabeçalho com logo e título */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/símbolos católicos.jpg')}
          style={styles.logo}
          resizeMode="contain"
          accessible
          accessibilityLabel="Logo da aplicação com símbolos católicos"
        />
        <Text style={styles.appTitle}>Devout Catholic</Text>
      </View>

      {/* Corpo da anotação */}
      <Text style={styles.sectionTitle}>Título:</Text>
      <Text style={styles.text}>{titulo}</Text>

      <Text style={styles.sectionTitle}>Data de Criação:</Text>
      <Text style={styles.text}>{formatarData(dataCriacao)}</Text>

      <Text style={styles.sectionTitle}>Descrição:</Text>
      <Text style={styles.text}>{descricao}</Text>

      {/* Botão de voltar */}
      <View style={styles.botaoVoltar}>
        <Button title="Voltar para Anotações" onPress={() => router.back()} color="#1e90ff" />
      </View>
    </View>
  );
}

function formatarData(dataIso: string | string[]) {
  const data = new Date(typeof dataIso === 'string' ? dataIso : dataIso[0]);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  botaoVoltar: {
    marginTop: 20,
  },
});
