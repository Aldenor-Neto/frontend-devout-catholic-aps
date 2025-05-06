import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    Button,
    Alert,
    Switch,
    Platform,
} from 'react-native';

export default function App() {

    const router = useRouter();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [modoCadastro, setModoCadastro] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const urlBase = 'http://192.168.100.21:8080';

    const handleLogin = async () => {
        try {
            const response = await fetch(urlBase + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password: senha }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token; 

                await AsyncStorage.setItem('authToken', token);
                
                    router.replace('/screens/home'); 
            } else {
                const erro = await response.text();
                Platform.OS === 'web'
                    ? window.alert(`Erro: ${erro}`)
                    : Alert.alert('Erro', erro);
            }
        } catch (error) {
            const mensagemErro = (error as any)?.message ?? String(error);
            Platform.OS === 'web'
                ? window.alert(`Erro de conexão: ${mensagemErro}`)
                : Alert.alert('Erro', `Erro de conexão: ${mensagemErro}`);
        }
    };

    const handleCadastro = async () => {
        if (!modoCadastro) {
            setModoCadastro(true);
            return;
        }

        try {
            const response = await fetch(urlBase + '/login/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password: senha }),
            });

            if (response.ok) {
                const data = await response.json();
                const mensagem = `${data.mensagem} para: ${data.email} `;
                Platform.OS === 'web'
                    ? window.alert(mensagem)
                    : Alert.alert('Cadastro', mensagem);

                setNome('');
                setEmail('');
                setSenha('');
                setModoCadastro(false);
            } else {
                const erro = await response.text();
                Platform.OS === 'web'
                    ? window.alert(`Erro: ${erro}`)
                    : Alert.alert('Erro', erro);
            }
        } catch (error) {
            const mensagemErro = (error as any)?.message ?? String(error);
            Platform.OS === 'web'
                ? window.alert(`Erro de conexão: ${mensagemErro}`)
                : Alert.alert('Erro', `Erro de conexão: ${mensagemErro}`);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/símbolos católicos.jpg')}
                style={styles.image}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel="imagem de Uma cruz de madeira centralizada, com um cálice dourado à esquerda e uma Bíblia marrom à direita, acompanhada de duas hóstias brancas. Ao redor da cruz, há ramos verdes formando uma coroa. No fundo, há um círculo amarelo com raios que emanam do centro. Na parte inferior, há uma faixa amarela em branco"
            />

            <Text style={styles.title}>Devout Catholic</Text>

            <Text style={styles.formTitle}>{modoCadastro ? 'Cadastro' : 'Login'}</Text>

            <View style={styles.form}>
                {modoCadastro && (
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        placeholderTextColor="#666"
                        value={nome}
                        onChangeText={setNome}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#666"
                    secureTextEntry={!mostrarSenha}
                    value={senha}
                    onChangeText={setSenha}
                />

                <View style={styles.switchContainer}>
                    <Switch
                        value={mostrarSenha}
                        onValueChange={setMostrarSenha}
                    />
                    <Text style={styles.switchText}>Mostrar senha</Text>
                </View>

                {!modoCadastro && (
                    <View style={styles.buttonContainer}>
                        <Button title="Entrar" color="#1e90ff" onPress={handleLogin} />
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <Button
                        title={modoCadastro ? 'Fazer Cadastro' : 'Cadastrar'}
                        color="#32CD32"
                        onPress={handleCadastro}
                    />
                </View>
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
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4A4A4A',
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
    },
    form: {
        width: '100%',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 10,
    },
});
