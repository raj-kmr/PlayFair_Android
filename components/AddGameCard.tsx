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
      className="w-full rounded-2xl p-4 mb-2 items-center justify-center 
             bg-zinc-100 active:scale-[0.98] active:opacity-80"
    >
      <View className="items-baseline justify-center gap-2 flex flex-row">
        <View className="w-6 h-6 rounded-full  bg-white flex items-center justify-center  shadow-sm">
          <Text className="text-sm font-medium text-zinc-800">+</Text>
        </View>

        <Text className="mt-2 text-sm font-bold text-zinc-600">
          Add Game
        </Text>
      </View>
    </Pressable>
  );
}