import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {useState, useEffect} from "react";
import { HStack } from 'native-base';
import * as info from '../chords.json';


const totalChords = ["Amaj","Bmin", "Dbmin", "Dmaj", "Emaj", "Gbmin", "Bmaj", "Ebmin", "Gbmaj", "Abmin", "Cmaj", "Dmin", "Emin", "Fmaj", "Gmaj", "Amin","Gmin","Bbmaj"];
const presets =["None","Amaj", "Amin", "Bmaj", "Bmin", "Cmaj", "Cmin", "Dmaj", "Dmin", "Emaj", "Emin", "Fmaj", "Fmin", "Gmaj", "Gmin"];
var chordClicked ="";
var chords =[];


export default function SearchScreen({navigation}){
  const [index, setIndex] =useState(0);
  const [currentPreset, setPreset]=useState("None");
  const [chordIndexes, setI]=useState([]);
  const [isEmpty, setIsEmpty] =useState(true);
  const [chordString, setChordString]=useState("");
  const [theoryString, setTheoryString] = useState(""); 
  const [chordInfo, setChordInfo] = useState();

  useEffect(()=>{
    getChordInfo();
  },[]);

  const getChordInfo = () =>{
    console.log(info);
  }

  function setChordText(){
    setChordString("");
    for (let j=0;j<chords.length;j++){
      if(j==0){
        setChordString(chordString+String(chords[j]));
      }
      else{
        setChordString(chordString+("-" + String(chords[j])));
      }
    }
  }

  return (
    <View>
      <StatusBar style="auto" />
      <View style={styles.presetContainer}>
        <SelectDropdown 
          data={presets}
          defaultButtonText='Select Preset'
          buttonStyle = {styles.preset}
          onSelect={(selectedItem)=>{ 
          setPreset(selectedItem); 
          console.log(currentPreset);
          setPresetIndex(selectedItem); 
          setIndex(0);
          chords=[];
          setIsEmpty(true);
          setChordString("");
          console.log(chordIndexes);
          console.log(chords);
          console.log(index)}}

      />
      </View>
      <HStack space={3} justifyContent="center" marginTop={10}>
        <View style={styles.left}>
          {(index==3 && chordIndexes.length>0)? <Button title="Prev" onPress={()=>{setIndex(index-3)}}></Button> :null}
        </View>
        {chordIndexes.length>0?
          <HStack space={3} justifyContent="center">
            <View style={styles.button}>
              <Button title={totalChords[chordIndexes[index]]} onPress={()=>{chordClicked=totalChords[chordIndexes[index]]; setSearchArray(); setIsEmpty(false); setChordText();}}></Button>
            </View>
            <View style={styles.button}>
              <Button title={totalChords[chordIndexes[index+1]]} onPress={()=>{chordClicked=totalChords[chordIndexes[index+1]]; setSearchArray(); setIsEmpty(false); setChordText();}}></Button>
            </View>
            <View style={styles.button}>
              <Button title={totalChords[chordIndexes[index+2]]} onPress={()=>{chordClicked=totalChords[chordIndexes[index+2]]; setSearchArray(); setIsEmpty(false); setChordText();}}></Button>
            </View>
          </HStack>
          : null
        }
        <View style={styles.right}>
          {(index==0 && chordIndexes.length>0)? <Button title="Next" onPress={()=>{setIndex(index+3)}}></Button> :null}
        </View>
      </HStack>
      <View>
          {!isEmpty?
            <Button title="Submit" onPress={()=>{
              setChordText();
              console.log(chordString);
              navigation.navigate('Results', {chordString:chordString})
            }}></Button>
          :null}
          {!isEmpty?
            <Button title= "Clear search" onPress={()=>{ clearSearch();}}></Button>
          :null}
          {!isEmpty? 
            <Text style={styles.chordText}>Current chords: {chordString} </Text>
          :null} 
        </View>
        <Button title="Song" onPress={()=>{navigation.navigate('Song')}}></Button>
    </View>
  );

  function setTheory(){
    setTheoryString("");

  }

  function clearSearch(){
    setChordString("");
    chords =[];
    setIsEmpty(true);
    console.log(chords);
  }

  function setPresetIndex(preset){
    if (preset=="Amaj"){
      setI([0,1,2,3,4,5]);
    }
    else if(preset=="Bmaj"){
      setI([6,2,7,4,5,9]);
    }
    else if(preset=="Cmaj"){
      setI([10,11,12,13,14,15]);
    }
    else if(preset=="Dmaj"){
      setI([3,12,5,14,0,1]);
    }
    else if(preset=="Emaj"){
      setI([4,5,9,0,6,2]);
    }
    else if(preset=="Fmaj"){
      setI([13,16,15,17,10,11]);
    }
    else if(preset=="Gmaj"){
      setI([14,15,1,10,3,12]);
    }
    else if(preset=="None"){
      setI([0,1,2,3,4,5])
    }
    else{
      setI([]);
    }
  }

  function setSearchArray(){
    let newChords=[];
    let found = false;
    for (let i=0;i<chords.length;i++){
      newChords.push(chords[i]);
      if (chords[i]==chordClicked){
        console.log("Chord same");
        newChords.pop();
        found =true;
      }
    }
    if (!found){
      newChords.push(chordClicked);
    }
    chords = newChords;
    console.log(newChords);
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingTop: 20,
  },
  preset:{
    backgroundColor: 'aquamarine',
  },
  button:{
    backgroundColor: 'aquamarine',
    justifyContent: 'center',
    alignContent:'center',
    padding:10,
  },
  right:{
    marginTop: 10,
    marginRight:-340,
  },
  left:{
    marginTop:10,
    marginLeft:-340,
  },
  chordText:{
    padding:20
  }
});
