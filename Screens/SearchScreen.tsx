import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {useState, useEffect} from "react";
import { HStack } from 'native-base';
import * as info from '../chords.json';


var chordClicked ="";
var chords =[];


export default function SearchScreen({navigation}){
  const [index, setIndex] =useState(0);
  const [currentPreset, setPreset]=useState("None");
  const [presets, setPresets] = useState([]);
  const [isEmpty, setIsEmpty] =useState(true);
  const [chordString, setChordString]=useState("");
  const [theoryString, setTheoryString] = useState(""); 
  const [chordsToClick, setChordsToClick]=useState([]);

  useEffect(()=>{
    getChordInfo();
  },[]);

  const getChordInfo = () =>{
    console.log(info);
    let totalPresets =[];
    for (let i=0; i<info.presets.length;i++){
      totalPresets = presets;
      totalPresets.push(info.presets[i].key);
      setPresets(totalPresets);
    }
  }

  let Buttons =[];
  function buttons(){
    for (let i=0;i<3;i++){
      Buttons.push(
        <View key={i} style={styles.button}>
          <Button title={chordsToClick[index+i]} onPress={()=>{chordClicked=chordsToClick[index+i]; setSearchArray(); setIsEmpty(false); setTheory();}}></Button>
        </View>
      )
    }
  }

  function setTheory(){
    setTheoryString("");
    let theory="";
    let chord;
    for(let i=0;i<info.chords.length;i++){
      if(info.chords[i].name==chordClicked){
        chord = info.chords[i];
      }
    }
    if (chord.type=="minor") {
      theory+=info.terminology.minor;
    } 
    else{
      theory+=info.terminology.major;
    }
    theory+=chord.notes + ". ";
    if(chord.flat){
      theory+= "\n\n" + info.terminology.flat;
    }
    setTheoryString(theory);
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

  function DealWithPresets(Preset){
    for(let i=0; i<info.presets.length;i++){
      if (info.presets[i].key==Preset){
        let currentChordSelection=[];
        console.log(currentChordSelection);
        for (let j=0; j<info.presets[i].chords.length;j++){
          currentChordSelection.push(info.presets[i].chords[j]);
        }
        setChordsToClick(currentChordSelection);
        console.log(chordsToClick);
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
          let empty =[];
          setChordsToClick(empty);
          DealWithPresets(selectedItem);
          console.log(chordsToClick);
          //setPresetIndex(selectedItem); 
          setIndex(0);
          chords=[];
          setIsEmpty(true);
          setChordString("");
          //console.log(chordIndexes);
          console.log(chords);
          console.log(index)}}

      />
      </View>
      <HStack space={3} justifyContent="center" marginTop={10}>
        <View style={styles.left}>
          {(index==3 && chordsToClick.length>0)? <Button title="Prev" onPress={()=>{setIndex(index-3)}}></Button> :null}
        </View>
        {chordsToClick.length>0?
          <HStack space={3} justifyContent="center">
            {buttons()}
            {Buttons}
          </HStack>
          : null
        }
        <View style={styles.right}>
          {(index==0 && chordsToClick.length>0)? <Button title="Next" onPress={()=>{setIndex(index+3)}}></Button> :null}
        </View>
      </HStack>
      <View>
        <HStack space={5} justifyContent="center" marginTop={2}>
            <View>
              {!isEmpty?
                <Button title= "Clear search" onPress={()=>{ clearSearch();}}></Button>
              :null}
            </View>
          <View>
              {!isEmpty?
                <Button title="Submit" onPress={()=>{
                  console.log(chordString);
                  navigation.navigate('Results', {chordString:chordString})
                }}></Button>
              :null}
          </View>
        </HStack>
          {!isEmpty? 
            <Text style={styles.chordText}>Current chords: {chordString} </Text>
          :null} 
      </View>
      {chordClicked!=""?
        <View style={styles.terminologyArea}>
          <Text style={{fontSize:15}}>{theoryString}</Text>
        </View>
      :null}
    </View>
  );

  function clearSearch(){
    setChordString("");
    chords =[];
    setIsEmpty(true);
    chordClicked="";
    console.log(chords);
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
      chords = newChords;
      setChordText();
      console.log(newChords);
      return;
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
    backgroundColor: 'lightgray',
    borderRadius: 10
  },
  button:{
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignContent:'center',
    padding:10,
    borderRadius: 10
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
    padding:10,
    marginLeft:10,
    fontSize:15
  },
  terminologyArea:{
    padding:20,
    backgroundColor: 'lightgray',
    borderRadius:10,
    margin: 10,
  },
});
