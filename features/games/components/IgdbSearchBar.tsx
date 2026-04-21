import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
      <View style={styles.searchRow}>
        <MaterialIcons name="search" size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          placeholder="Search games..."
          value={value}
          onChangeText={onChangeText}
          autoCorrect={false}
          placeholderTextColor="#475569"
          style={styles.input}
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChangeText("")} style={styles.clearBtn}>
            <MaterialIcons name="close" size={20} color="#64748b" />
          </Pressable>
        ) : null}
      </View>

      {searching ? (
        <View style={styles.statusRow}>
          <MaterialIcons name="hourglass-empty" size={16} color="#a78bfa" />
          <Text style={styles.statusText}>Searching...</Text>
        </View>
      ) : q.length >= 2 && !hasResults ? (
        <View style={styles.statusRow}>
          <MaterialIcons name="search-off" size={16} color="#f87171" />
          <Text style={[styles.statusText, { color: "#f87171" }]}>No results found</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#f1f5f9",
  },
  clearBtn: {
    padding: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
  },
  statusText: {
    fontSize: 13,
    color: "#a78bfa",
    fontWeight: "500",
  },
});
