import { StyleSheet, Text, View } from "react-native"
import type { ReactNode } from "react"

interface Props {
    title: string,
    value: string | number | ReactNode,
    trend?: 'up' | 'down' | null
}

export default function StatCard({title, value, trend = null}: Props) {
    return (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.value}>{value}</Text>
                {trend === 'up' && (
                    <Text style={{ color: '#00C853', marginLeft: 4, fontSize: 16 }}>&uparrow;</Text>
                )}
                {trend === 'down' && (
                    <Text style={{ color: '#ff4444', marginLeft: 4, fontSize: 16 }}>&downarrow;</Text>
                )}
            </View>
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