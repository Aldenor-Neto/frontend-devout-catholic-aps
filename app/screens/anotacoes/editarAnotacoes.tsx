import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditarAnotacao() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataOriginal, setDataOriginal] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarAnotacao = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) throw new Error('Token não encontrado. Faça login novamente.');

                const response = await fetch(`http://192.168.100.21:8080/anotacoes/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Erro ao carregar a anotação.');

                const anotacao = await response.json();
                setTitulo(anotacao.titulo);
                setDescricao(anotacao.descricao);
                setDataOriginal(anotacao.dataCriacao);
            } catch (error: any) {
                const msg = error.message || 'Erro inesperado ao carregar anotação.';
                Platform.OS === 'web'
                    ? window.alert(msg)
                    : Alert.alert('Erro', msg);
            } finally {
                setLoading(false);
            }
        };

        carregarAnotacao();
    }, [id]);

    const handleSalvarAlteracoes = async () => {
        if (!titulo.trim() || !descricao.trim()) {
            const msg = 'Título e descrição são obrigatórios.';
            Platform.OS === 'web'
                ? window.alert(msg)
                : Alert.alert('Erro', msg);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) throw new Error('Token não encontrado. Faça login novamente.');

            const response = await fetch(`http://192.168.100.21:8080/anotacoes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: Number(id),
                    titulo: titulo.trim(),
                    descricao: descricao.trim(),
                    dataCriacao: dataOriginal, 
                }),
            });

            if (!response.ok) throw new Error('Erro ao atualizar a anotação.');

            const msg = `Anotação atualizada com sucesso:\nTítulo: ${titulo}`;
            Platform.OS === 'web'
                ? window.alert(msg)
                : Alert.alert('Sucesso', msg);

            router.replace('/screens/anotacoes/anotacoes');
        } catch (error: any) {
            const msg = error.message || 'Erro inesperado ao atualizar a anotação.';
            Platform.OS === 'web'
                ? window.alert(msg)
                : Alert.alert('Erro', msg);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e90ff" />
                <Text>Carregando anotação...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Anotação</Text>

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
                <Button title="Salvar alterações" onPress={handleSalvarAlteracoes} color="#1e90ff" />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Cancelar" onPress={() => router.back()} color="#f44336" />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
