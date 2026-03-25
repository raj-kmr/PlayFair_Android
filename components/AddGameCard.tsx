import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";


/*
* Reusable Add Game Card.
* This keeps creation trigger seperate from gameCard logic 
*/
type Props = {
    onPress: () => void;
}

export default function AddGameCard({onPress}: Props) {
    return (
        <Pressable 
            style={({pressed}) => [styles.card, pressed && {opacity: 0.7}]}
            onPress={onPress}
        >
            <View style={styles.center}>
                <Text style={styles.plus}>+</Text>
                <Text className=" text-emerald-700 bg-red-600" style={styles.label}>Add Game</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 14,
        padding: 20,
        marginBottom: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    center: {
        alignItems: "center",
    }, 
    plus: {
        fontSize: 26,
        fontWeight: "700",
        color: "#000",
    },
    label: {
        marginTop: 4,
        opacity: 0.7,
        color: "#000",
    }
})