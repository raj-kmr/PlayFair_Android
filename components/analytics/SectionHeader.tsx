import { StyleSheet, Text } from "react-native";


export default function SectionHeader({title}: {title: string}) {
    return <Text style={styles.header}>{title}</Text>
}

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        fontWeight: "600",
        marginVertical: 10,
        color: "#000"
    }
})