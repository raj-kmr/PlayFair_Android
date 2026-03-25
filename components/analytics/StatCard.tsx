import { StyleSheet, Text, View } from "react-native"

interface Props {
    title: string,
    value: string | number
}

export default function StatCard({title, value}: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#dddddd",
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
        minWidth: 100
    },

    value: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000"
    },

    label: {
        fontSize: 12,
        color: "#1e1e1e",
        marginTop: 5
    }
})