import React, { useState } from 'react';
import { View } from 'react-native'

import { CustomContainer } from '../../components/CustomContainer';
import { CustomHeader } from '../../components/CustomHeader';
import { CustomButton } from '../../components/CustomButton';
import { CustomLink } from '../../components/CustomLink';
import { CustomInput } from '../../components/CustomInput';

export default function TelaResetarSenha({ navigation }) {
  return (
    <CustomContainer>
      <CustomHeader />
      <View>
        <CustomInput 
          title="Email"
          placeholder="contato@gmail.com"
          keyboardType={'email-address'}
        />
        <CustomButton
          title="Recuperar"
        />

        <CustomLink
          title="Voltar"
          onPress={() => navigation.navigate('TelaLogin')}
        />
      </View>
    </CustomContainer>
  );
}
