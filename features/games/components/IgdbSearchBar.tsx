import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

type IgdbSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  searching: boolean;
  hasResults: boolean;
};

export function IgdbSearchBar({
  value,
  onChangeText,
  searching,
  hasResults,
}: IgdbSearchBarProps) {
  const q = value.trim();

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="e.g. Elden ring"
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        placeholderTextColor={"#888"}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
        >
          <Text>Clear</Text>
        </Pressable>
      ) : null}

      {searching ? (
        <Text>Searching...</Text>
      ) : q.length >= 2 && !hasResults ? (
        <Text>No results!</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 7, gap: 8, marginBottom: 30, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#000",
  },
});
