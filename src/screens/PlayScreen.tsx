import { useRef, useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  SafeAreaView,
  Animated,
  Dimensions,
  Button,
  FlatList,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EqualizerButtonsBox, PlayButtonsBox } from "../components/Wrappers";
import { BackToPreviousScreen, ShuffleButton } from "../components/Buttons";
import ProgressBar from "../components/ProgressBar";
import MusicTracksSlider from "../components/MusicTracksSlider";

import useSound from "../hooks/useSound";

import { colors } from "../ui/colors";

import { RootStackParamList } from "../types/navigator.types";

const { width } = Dimensions.get("window");

const PlayScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "PlayScreen">) => {
  const {
    isPlaying,
    selectedTrack,
    play,
    pause,
    prev,
    next,
    duration,
    position,
    progress,
    playFromPosition,
    shuffle,
    handleChangeShuffle,
    startMusicPlay,
  } = useSound();

  const trackIndex = route.params.trackIndex;
  const navigateToPreviousScreen = () => {
    navigation.goBack();
  };
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList | null>(null);

  const [scrollIndex, setScrollIndex] = useState(selectedTrack);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      const newIndex = Math.round(value / width);
      setScrollIndex(newIndex);
    });
    return () => scrollX.removeAllListeners();
  }, [scrollX]);

  useEffect(() => {
    if (scrollIndex > selectedTrack) {
      next();
    }
    if (scrollIndex < selectedTrack) {
      prev();
    }
  }, [scrollIndex]);

  useEffect(() => {
    if (flatListRef.current && selectedTrack !== null) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: selectedTrack,
      });
    }
  }, [selectedTrack]);

  useEffect(() => {
    startMusicPlay(trackIndex);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackToPreviousScreen
        navigateToPreviousScreen={navigateToPreviousScreen}
      />

      <MusicTracksSlider
        selectedTrack={selectedTrack}
        scrollX={scrollX}
        flatListRef={flatListRef}
      />

      <ProgressBar
        duration={duration}
        progress={progress}
        position={position}
        playFromPosition={playFromPosition}
      />
      <View style={styles.mediaButtonsContainer}>
        <ShuffleButton
          shuffle={shuffle}
          handleChangeShuffle={handleChangeShuffle}
        />
        <PlayButtonsBox
          isPlaying={isPlaying}
          play={play}
          pause={pause}
          prev={prev}
          next={next}
        />
        <EqualizerButtonsBox />
      </View>
    </SafeAreaView>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: "10%",
    paddingBottom: "10%",
    backgroundColor: colors["background-dark"],
  },

  mediaButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});