import { StyleSheet, Text } from "react-native";


export default function SectionHeader({title}: {title: string}) {
    return <Text style={styles.header}>{title}</Text>
}

const styles = StyleSheet.create({
    header: {
        fontSize: 16,
        fontWeight: "700",
        marginVertical: 12,
        color: "#f1f5f9",
    }
})