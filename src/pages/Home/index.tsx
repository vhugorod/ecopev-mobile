import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import styles from './styles';

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

    if (selectedUf === '0' || selectedCity === '0') {
      return;
    }

    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  };

  return (
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Reduza Reutilize Recicle</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma simples.</Text>
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
              Checar pontos de coleta
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
  );
};

export default Home;
