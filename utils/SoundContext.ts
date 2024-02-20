import React from "react";
import { Audio } from "expo-av";

export interface SoundBoard {
    [key: string]: Audio.Sound
  }

export const SoundContext = React.createContext<SoundBoard>(null);

