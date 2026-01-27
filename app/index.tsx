import { ScrollView, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <ScrollView>
        <View>
          <Text>Hello</Text>
        </View>
        <View>
          <Text>Me</Text>
        </View>
        <View>
          <Text>Here</Text>
        </View>
      </ScrollView>
    </View>
  );
}
