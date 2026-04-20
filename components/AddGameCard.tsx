import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";


/*
* Reusable Add Game Card.
* This keeps creation trigger seperate from gameCard logic 
*/
type Props = {
  onPress: () => void;
};

export default function AddGameCard({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 items-center justify-center active:scale-[0.95] shadow-lg shadow-violet-500/30"
    >
      <View className="items-center justify-center">
        <Text className="text-3xl font-bold text-white mb-[-2]">+</Text>
      </View>
    </Pressable>
  );
}