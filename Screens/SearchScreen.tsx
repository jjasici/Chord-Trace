import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import * as React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {useState, useEffect} from "react";
import { HStack } from 'native-base';
import info, { Chord } from '../chords';
import { SoundContext } from '../utils/SoundContext';

export default function SearchScreen({navigation}){
  const [chordMenuIndex, setChordMenuIndex] = useState(0);
  const [presets, setPresets] = useState([]);
  const sounds = React.useContext(SoundContext);
  const [availableChords, setAvailableChords] = useState<Chord[]>([]);
  const [chordsSelected, setChordsSelected] = useState<Chord[]>([]);
  const [currentChordSelected, setCurrentChordSelected] = useState<Chord>();

  interface PlayChordButtonProps {
      chord: Chord,
  }

  // event handlers

  function onChordSelected(chord: Chord) {
    console.log('Chord selected', chord);
    if (chordsSelected.includes(chord)) {
        setChordsSelected(chordsSelected.filter(c => c !== chord));
        setCurrentChordSelected(null);
    } else {
        playSound(chord.name);
        setCurrentChordSelected(chord);
        setChordsSelected([...chordsSelected, chord]);
    }
  }

  function onPresetSelected(preset: string){
    info.presets.forEach((item)=>{
      if(item.key==preset){
        setAvailableChords(
          item.chords.map((chordName) => {
            return info.chords.find((chord) => chord.name === chordName);
          })
        );
      }
    });
  }
  
  
  // Components

  function PlayChordButton(props: PlayChordButtonProps) {
      return (
          <View style={styles.chordButton}>
            <Pressable onPress={()=>{
              onChordSelected(props.chord);
            }}>
              <Text style={{fontSize:15}}>{props.chord.name}</Text>
            </Pressable>
          </View>
      )
  }


  // helpers

  function generateSelectedChordsString() {
      return chordsSelected.map(chord => chord.name).join('-');
  }

  function generateTheoryString(chord: Chord) {
      let theory = "";
      theory += info.terminology[chord.type];
      theory += chord.notes + ". ";
      if (chord.flat) {
          theory += "\n\n" + info.terminology.flat;
      }
      return theory;
  }

  function clearSearch(){
    setChordsSelected([]);
    setCurrentChordSelected(null);
  }

  async function playSound(chordName: string) {
        if (sounds[chordName]) {
          console.log('Playing sound', chordName);
          await sounds[chordName].replayAsync();
        } else {
            console.log('Sound not loaded');
            console.log('list of all loaded sounds', Object.keys(sounds));
        }      
  }

  useEffect(()=>{
    let totalPresets =[];
      for (let i=0; i<info.presets.length;i++){
        totalPresets = presets;
        totalPresets.push(info.presets[i].key);
      }   
      setPresets(totalPresets);
  }, []);

  return (
    <View>
      <StatusBar style="auto" />
      <View style={styles.presetContainer}>
        <SelectDropdown 
          data={presets}
          defaultButtonText='Select Preset'
          buttonStyle = {styles.preset}
          onSelect={(selectedItem)=>{ 
          onPresetSelected(selectedItem);
          setChordMenuIndex(0);
          clearSearch();
        }}

      />
      </View>
      <HStack space={3} justifyContent="center" marginTop={10}>
        <View style={styles.left}>
          {(chordMenuIndex==3 && availableChords.length>0)? <Pressable style={styles.button} onPress={()=>{setChordMenuIndex(chordMenuIndex-3)}}>
            <Text style={{color:'white'}}>Prev</Text>
          </Pressable> :null}
        </View>
        {availableChords.length>0?
          <HStack space={3} justifyContent="center">
            {
              availableChords.slice(chordMenuIndex, chordMenuIndex+3).map((chord, i) => (
                <PlayChordButton key={i} chord={chord}/>
              ))
            }
          </HStack>
          : null
        }
        <View style={styles.right}>
          {(chordMenuIndex==0 && availableChords.length>0)? <Pressable style={styles.button} onPress={()=>{setChordMenuIndex(chordMenuIndex+3)}}>
              <Text style={{color:'white'}}>Next</Text>
          </Pressable> :null}
        </View>
      </HStack>
      <View>
        <HStack space={5} justifyContent="center" marginTop={2}>
            <View>
              {!(chordsSelected.length==0)?
                <Pressable style={[styles.button, {width:120}]} onPress={()=>{ clearSearch();}}>
                  <Text style={{color:'white'}}>Clear Search</Text>
                </Pressable>
              :null}
            </View>
          <View>
              {!(chordsSelected.length==0)?
                <Pressable style={styles.button} onPress={()=>{
                  navigation.navigate('Results', {chordString:generateSelectedChordsString()})
                }}>
                  <Text style={{color:'white'}}>Submit</Text>
                </Pressable>
              :null}
          </View>
        </HStack>
          {!(chordsSelected.length==0)? 
            <Text style={styles.chordText}>Current chords: {generateSelectedChordsString()} </Text>
          :null} 
      </View>
      {currentChordSelected ?
        <View style={styles.terminologyArea}>
          <Text style={{fontSize:15}}>{
            generateTheoryString(currentChordSelected)
          }</Text>
        </View>
      :null}
      <Button title="Test Song" onPress={()=>{
        navigation.navigate('Test')
      }}></Button>
    </View>
  );
}


export const styles = StyleSheet.create({
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
  chordButton:{
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignContent:'center',
    padding:10,
    borderRadius: 10,
    width: 80,
    height: 50,
    alignItems: 'center'
  },
  button:{
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignContent:'center',
    padding:10,
    borderRadius: 10,
    width: 80,
    height: 50,
    alignItems: 'center'
  },
  right:{
    marginRight:-340,
  },
  left:{
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
