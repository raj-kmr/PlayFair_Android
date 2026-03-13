import { StyleSheet, Text, View } from "react-native"

type Props = {
    completed: number,
    total: number,
    percentage: number
}

export default function ProgressHeader({completed, total, percentage}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today's Progress</Text>
            <Text style={styles.subtitle}>
                {completed} / {total} tasks completed
            </Text>
            <Text style={styles.percentage}>{percentage}%</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#1e1e1e",
        marginBottom: 16
    },

    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700"
    },

    subtitle: {
        color: "#bbb",
        fontSize: 14,
        marginTop: 6
    },

    percentage: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        marginTop: 8
    }
})