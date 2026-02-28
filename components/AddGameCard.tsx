import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/*
* Reusable Add Game Card.
* This keeps creation trigger seperate from gameCard logic 
*/
type Props = {
    onPress: () => void;
}

export default function AddGameCard({onPress}: Props) {
    return (
        <Pressable style={({pressed}) => [styles.card, pressed && {opacity: 0.7}]} onPress={onPress}>
            <View style={styles.center}>
                <Text style={styles.plus}>+</Text>
                <Text style={styles.label}>Add Game</Text>
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: "#2a2a2a",
        borderRadius: 14,
        padding: 20,
        marginBottom: 12,
        alignItems: "center",
        justifyContent: "center"
    },
    center: {
        alignItems: "center"
    }, 
    plus: {
        fontSize: 26,
        fontWeight: "700"
    },
    label: {
        marginTop: 4,
        opacity: 0.7
    }
})