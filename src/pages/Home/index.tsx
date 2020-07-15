import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
};

interface IBGECityResponse {
  nome: string;
};

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {

    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {

      const ufInitials = res.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {

    if(selectedUf === '0') return;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {

      const cityNames = res.data.map(city => city.nome);
      setCities(cityNames);
    });
  }, [selectedUf]);

  const navigation = useNavigation();

  function handleNavigateToPoints() {

    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Reduza Reutilize Recicle</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect 
            style={{
              inputAndroid: {
                height: 60,
                backgroundColor: '#FFF',
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                fontSize: 16,
              }
            }}
            placeholder={{
              label: 'Selecione um estado',
              value: null
            }}
            onValueChange={value => setSelectedUf(value)}
            items={ufs.map(uf => (
              { label: uf, value: uf }
            ))}
          />
          
          <RNPickerSelect 
          style={{
            inputAndroid: {
              height: 60,
              backgroundColor: '#FFF',
              borderRadius: 10,
              marginBottom: 8,
              paddingHorizontal: 24,
              fontSize: 16,
            }
          }}
          placeholder={{
            label: 'Selecione uma cidade',
            value: null
          }}
          onValueChange={value => setSelectedCity(value)}
          items={cities.map(city => (
            { label: city, value: city }
          ))}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#083f44',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 200,
    marginTop: 64,
    lineHeight: 40,  
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#288B45',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
