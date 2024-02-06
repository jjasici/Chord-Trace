import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {useState, useEffect} from "react";
import { WebView } from 'react-native-webview';
export default function SongScreen({navigation}){

    const [data, setData] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError]=useState();

    useEffect(()=>{
      GetSong();
    },[]);

    const GetSong = async() => {
      Loading();
      await fetch(
        `https://api.deezer.com/oembed?url=https://www.deezer.com/track/676576`,
        {
          headers: {
            "Content-Type" : "application/json"
          },
        }
        ).then((res) => {
          console.log(res);
        }).then((json) => {
          console.log("Please");
          console.log(json);
          console.log(json.html);
          setLoading(false);
          setData(json.html);
        },
        (error)=>{
          console.log(error);
          setError(error);
        })
        
    }

    const Loading=()=>{
      if (isLoading){
        return <Text>Loading...</Text>;
      }
      if (error){
        return <Text>Error</Text>;
      }
      if (!isLoading&&data!=null){
        return returnPlayer();
      }
    };

    const returnPlayer=()=>{
      return <View>
          <StatusBar style="auto"/>
          <View style={styles.presetContainer}>
          dataLoaded && 
          <WebView
            style={styles.container}
            originWhitelist={['*']}
            source={{ html: () => {
              let f =  GetSong(data);
              console.log("Logging f within webview" + f);
            } }}
            // source = {{html: '<iframe id="deezer-widget" src="https://widget.deezer.com/widget/dark/track/676576?app_id=457142&autoplay=false&radius=true&tracklist=false" width="420" height="420" allowtransparency="true" allowfullscreen="true" allow="encrypted-media"></iframe>'}}
          />
          </View>
        </View>;
    }
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    presetContainer:{
      width: 500,
      height: 200
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
  