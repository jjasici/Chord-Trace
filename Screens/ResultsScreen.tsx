import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Pressable } from 'react-native';
import {useRoute} from "@react-navigation/native";
import {useState, useEffect} from "react";
import * as React from 'react';
import {Box, HStack, VStack} from 'native-base';

type ChordString = {
  chordString: string;
}

export default function ResultsScreen({navigation}) {
  const route = useRoute();
  const params=route.params as ChordString;
  const chordString = params.chordString;
  const [error, setError]=useState();
  const [response,setResponse]=useState();
  const [isLoading, setLoading]=useState(true);
  const [tracks, setTracks]=useState();
  const [offset, setOffset]=useState(0);
  const [tracksBool, setTrackBool ]=useState(true);
  const [reload, setReload]=useState(true);
  

  useEffect(()=>{
    getResponse();
  });
  
  const getResponse=async()=>{
    if (reload){
      setReload(false);
      setTracks(null);
      setLoading(true);
      Loading();
      await fetch("https://audio-analysis.eecs.qmul.ac.uk/function/search/audiocommons/10/" + String(offset) +"?namespaces=jamendo-tracks&chords="+chordString)
    .then(res=>res.json())
    .then(
      (result)=>{
        setResponse(result);
        setTrackBool(true);
    },
    (error)=>{
      setLoading(false);
      setError(error);
    });
    }
    if (response&&tracksBool){
      let idsString="";
      for(let i=0;i<response.length;i++){
        if(i<response.length-1){
          idsString+=response[i].id.split(":")[1] + "+";
        }
        else{
          idsString+=response[i].id.split(":")[1];
        }
      }
      console.log(idsString);
      getTracks(idsString);
      setTrackBool(false);
    }
  }

  const getTracks=async(ids)=>{
    await fetch("https://api.jamendo.com/v3.0/tracks/?client_id=5ee07b07&format=jsonpretty&id="+ids)
    .then(res=>res.json())
    .then(
      (result)=>{
        setTracks(result);
        setLoading(false);
    },
    (error)=>{
      setLoading(false);
      setError(error);
    });
  }


  const Loading=()=>{
    if (isLoading){
      return <Text>Loading...</Text>;
    }
    if (error){
      return <Text>{error}</Text>;
    }
    if (response!=null&&tracks!=null){
      return returnIDs();
    }
  };

  let Results=[];
  function getResults(){
    for(let i=0;i<Math.min(5,tracks.headers.results_count);i++){
      Results.push(
        <Box key={i} style={styles.Box}>
          <HStack space={1.5}>
            <Image 
              style={styles.img}
              source={{
                uri:tracks.results[i].album_image
              }}
            />
            <View style={styles.songInfo}>
              <Text style={styles.title}>{tracks.results[i].name}</Text>
              <Text>By {tracks.results[i].artist_name}</Text>
            </View>
            <Pressable
            onPress={() => {
              let objArray;
              for(let j=0;j<response.length;j++){
                if(response[j].id.split(":")[1]==tracks.results[i].id){
                  console.log(tracks.results[i].id)
                  objArray = response[j].chords.chordSequence;
                }
              }
              navigation.navigate('Song', {chosenSong:tracks.results[i].id, chordArray: objArray})
              }}>
                <Image
                  style={styles.buttonImg}
                  source={require('../Img/Forward.png')}
                />
            </Pressable>
          </HStack>
        </Box>
      )
    }
  }

  const returnIDs =()=>{
    return <View>
      <Box borderRadius="md">
      <VStack style={{alignItems:'center'}} space="1">
        {offset!=0? 
          <Pressable onPress={()=>{LoadPreviousIDs();}}>
            <Image style={styles.button} source={require('../Img/Up.png')}/>
          </Pressable>
        : null}
        <View style={styles.resultsArea}> 
          <VStack space="5">
            {getResults()}
            {Results}
          </VStack>
        </View>
        {tracks.headers.results_count>=5?
          <Pressable onPress={()=>{LoadNextIDs();}}>
            <Image style={styles.button} source={require('../Img/Down.png')}/>
          </Pressable>
        :null}
      </VStack>
      </Box>
    </View>;
  }

  function LoadNextIDs(){
    setOffset(offset+10);
    setReload(true);
  }

  function LoadPreviousIDs(){
    setOffset(offset-10);
    setReload(true);
  }

  return (
    <View style={styles.container}>
      {Loading()}
      <StatusBar style="auto" />
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
  Box:{
    backgroundColor: 'lightgray',
    padding:5,
    height:70,
    width: 350,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    borderRadius: 10
  },
  img:{
    padding:1,
    width:60,
    height: 60,
    borderRadius: 10
  },
  title:{
    fontWeight: 'bold',
    fontSize:16,
    padding:1,
    marginBottom:3
  },
  button:{
    width:50,
    height: 50,
  },
  buttonImg:{
    padding:1,
    width:50,
    height: 50,
    marginTop:5
  }, 
  songInfo:{
    width:225
  }, 
  resultsArea:{
    backgroundColor:'rgb(18, 18, 18)',
    alignItems:'center',
    padding:10,
    borderRadius: 10
  }
});
