import TaskSection from "@/features/dashboard/components/TaskSection";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to Playfair</Text>
          <Text style={styles.cardText}>Balance gaming with productivity</Text>
      </View>

      <TaskSection/>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    color: "#000",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  cardText: {
    color: "#fff",
    marginTop: 8,
  },
})