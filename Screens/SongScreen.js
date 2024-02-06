import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {useState} from "react";

export default function SongScreen({navigation}){


    return (
        <View>
          <StatusBar style="auto"/>
          <View style={styles.presetContainer}>
          
          </View>
         
          
        </View>
      );
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    presetContainer:{
      alignItems: 'left',
      justifyContent: 'left',
      paddingLeft: 20,
      paddingTop: 20,
    },
    preset:{
      backgroundColor: 'aquamarine',
    },
    button:{
      backgroundColor: 'aquamarine',
      justifyContent: 'centre',
      alignContent:'centre',
      padding:10,
    },
    right:{
      marginTop: 10,
      marginRight:-340,
    },
    left:{
      marginTop:10,
      marginLeft:-340,
    }
  });
  