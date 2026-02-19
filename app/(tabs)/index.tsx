import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [msg, setMsg] = useState("Loading..");

  const backendConnecting = async () => {
    try {
      const res = await fetch("http://192.168.1.13:3000/test");
      const data = await res.json();
      setMsg(data.message);
    } catch (err) {
      console.log(err);
      setMsg("Error whiile connecting");
    }
  };

  useEffect(() => {
    backendConnecting();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Playfair App</Text>
      <Text>{msg}</Text>
    </View>
  );
}
