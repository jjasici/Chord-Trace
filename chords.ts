type ChordType = "major" | "minor";
type PresetType = "majorPreset" | "minorPreset" | "none";

export type Chord =  {
  name: string,
  type: ChordType,
  notes: string,
  flat: boolean
}

export type Preset = { 
    key: string,
    chords: string[],
    type: PresetType
}

export type Terminology = {
    major: string,
    minor: string,
    flat: string,
    majorPreset : string,
    minorPreset: string,
    none: string
}

interface Information {
    chords: Chord[],
    presets: Preset[],
    terminology: Terminology
}

const info: Information = {
    "chords": [{"name": "Amaj", "type" : "major", "flat": false, "notes": "A-C#-E"}, 
               {"name": "Amin", "type" : "minor", "flat": false, "notes": "A-C-E"}, 
               {"name": "Abmaj", "type" : "major", "flat": true, "notes": "Ab-C-Eb"}, 
               {"name": "Abmin", "type" : "minor", "flat": true, "notes": "Ab-Cb-Eb"}, 
               {"name": "Bmaj" , "type" : "major", "flat": false, "notes": "B-D#-F#"}, 
               {"name": "Bmin" , "type" : "minor", "flat": false, "notes": "B-D-F#"}, 
               {"name": "Bbmaj" , "type" : "major", "flat": true, "notes": "Bb-D-F"}, 
               {"name": "Bbmin" , "type" : "minor", "flat": true, "notes": "Bb-Db-F"}, 
               {"name": "Cmaj" , "type" : "major", "flat": false, "notes": "C-E-G"}, 
               {"name": "Cmin", "type" : "minor", "flat": false,"notes": "C-Eb-G"}, 
               {"name": "Dmaj", "type" : "major", "flat": false, "notes": "D-F#-A"}, 
               {"name": "Dmin", "type" : "minor", "flat": false, "notes": "D-F-A"}, 
               {"name": "Dbmaj", "type" : "major", "flat": true, "notes": "Db-F-Ab"}, 
               {"name": "Dbmin", "type" : "minor", "flat": true, "notes": "Db-E-Ab"}, 
               {"name": "Emaj", "type" : "major", "flat": false, "notes": "E-G#-B"}, 
               {"name": "Emin", "type" : "minor", "flat": false, "notes": "E-G-B"},
               {"name": "Ebmaj", "type" : "major", "flat": true, "notes": "Eb-G-Bb"}, 
               {"name": "Ebmin", "type" : "minor", "flat": true, "notes": "Eb-Gb-Bb"}, 
               {"name": "Fmaj", "type" : "major", "flat": false, "notes": "F-A-C"}, 
               {"name": "Fmin", "type" : "minor", "flat": false, "notes": "F-Ab-C"},  
               {"name": "Gmaj", "type" : "major", "flat": false, "notes": "G-B-D"}, 
               {"name": "Gmin", "type" : "minor", "flat": false, "notes": "G-Bb-D"}, 
               {"name": "Gbmaj", "type" : "major", "flat": true, "notes": "Gb-Bb-Db"}, 
               {"name": "Gbmin", "type" : "minor", "flat": true, "notes": "Gb-A-Db"}],
    "presets":[{"key": "None", "chords": ["Amaj", "Amin", "Abmaj","Abmin","Bmaj", "Bmin", 
                "Bbmaj", "Bbmin", "Cmaj", "Cmin","Dmaj", "Dmin", "Dbmaj", "Dbmin", "Emaj", 
                "Emin", "Ebmaj", "Ebmin", "Fmaj", "Fmin", "Gmaj", "Gmin", "Gbmaj", "Gbmin"], "type": "none"},
               {"key": "Amaj", "chords": ["Amaj","Bmin", "Dbmin", "Dmaj", "Emaj", "Gbmin"], "type": "majorPreset"},
               {"key": "Amin", "chords": ["Amin","Cmaj", "Dmin", "Emin", "Fmaj", "Gmaj"], "type": "minorPreset"},
               {"key": "Bmaj", "chords": ["Bmaj","Dbmin", "Ebmin", "Emaj", "Gbmaj", "Abmin"], "type": "majorPreset"}, 
               {"key": "Bmin", "chords": ["Bmin","Dmaj", "Emin", "Gbmin", "Gmaj", "Amaj"], "type": "minorPreset"},
               {"key": "Cmaj", "chords": ["Cmaj","Dmin", "Emin", "Fmaj", "Gmaj", "Amin"], "type": "majorPreset"},
               {"key": "Cmin", "chords": ["Cmin","Ebmaj", "Fmin", "Gmin", "Abmaj", "Bbmaj"], "type": "minorPreset"},
               {"key": "Dmaj", "chords": ["Dmaj","Emin", "Gbmin", "Gmaj", "Amaj", "Bmin"], "type": "majorPreset"},
               {"key": "Dmin", "chords": ["Dmin","Fmaj", "Gmin", "Amin", "Bbmaj", "Cmaj"], "type": "minorPreset"},
               {"key": "Emaj", "chords": ["Emaj","Gbmin", "Abmin", "Amaj", "Bmaj", "Dbmin"], "type": "majorPreset"}, 
               {"key": "Emin", "chords": ["Emin","Gmaj", "Amin", "Bmin", "Cmaj", "Dmaj"], "type": "minorPreset"},
               {"key": "Fmaj", "chords": ["Fmaj","Gmin", "Amin", "Bbmaj", "Cmaj", "Dmin"], "type": "majorPreset"}, 
               {"key": "Fmin", "chords": ["Fmin","Abmaj", "Bbmin", "Cmin", "Dbmaj", "Ebmaj"], "type": "minorPreset"},
               {"key": "Gmaj", "chords": ["Gmaj","Amin", "Bmin", "Cmaj", "Dmaj", "Emin"], "type": "majorPreset"},
               {"key": "Gmin", "chords": ["Gmin","Bbmaj", "Cmin", "Dmin", "Ebmaj", "Fmaj"], "type": "minorPreset"}],
    "terminology":{"major": "This is a major chord. Major chords sound happy and consist of the first, third and fifth notes of the major scale, in this case ",
                   "minor": "This is a minor chord. Minor chords sound sad and consist of the first, minor third and fifth notes of the major scale, in this case ",
                   "flat": "This is also a flat chord. This simply means that the root of this chord is flat, i.e. a half-step below.",
                    "majorPreset" : "This preset is part of a major scale. Major scales mean that the notes in this scale ascend in a succession of 2 whole steps, one half step, 3 whole steps and then one whole step. A half step is simply a note that is right next to the note before it, and a whole step is 2 half steps away.",
                    "minorPreset": "This preset is part of a minor scale. Minor scales mean that the notes in this scale ascend in a succession of 1 whole step,1 half step, 2 whole steps, 1 half step and 2 whole steps. A half step is simply a note that is right next to the note before it, and a whole step is 2 half steps away.",
                    "none": "You have not selected a preset."}
}

export default info;