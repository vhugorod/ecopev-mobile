import React, { useEffect, useState } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, Text, Image, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    expedient: string;
    whatsapp: string;
    city: string;
    uf: string;
    latitude: string;
    longitude: string;
    recommendations: string,
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
    });
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }
  
  function handleWhatsapp() {
    Linking.openURL(`tel:${data.point.whatsapp}`);
  }

  function handleDirections() {
    Linking.openURL(`google.navigation:q=${data.point.latitude},${data.point.longitude}`);
  }

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex:1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#288B45" />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: data.point.image_url }} />
      
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.pointName}>{data.point.name}</Text>
          <Text style={styles.pointItems}>
            {data.items.map(item => item.title).join(', ')}
          </Text>

          <View style={styles.pointInfo}>
            <Text style={styles.infoTitle}>Dia e horário de entrega</Text>
            <Text style={styles.infoContent}>{data.point.expedient}</Text>
          </View>

          <View style={styles.pointInfo}>
            <Text style={styles.infoTitle}>Recomendações</Text>
            <Text style={styles.infoContent}>{data.point.recommendations}</Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="phone" size={25} color="#FFF" />
          <Text style={styles.buttonText}>Ligar</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleDirections}>
          <FontAwesome name="car" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Como chegar</Text>
        </RectButton>
      </View>
    </SafeAreaView>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 50,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#083f44',
    fontSize: 24,
    fontFamily: 'Ubuntu_700Bold',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  pointInfo: {
    marginTop: 20,
  },
  
  infoTitle: {
    color: '#083f44',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  infoContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 4,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#288B45',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;
