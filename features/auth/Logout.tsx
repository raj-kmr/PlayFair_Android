import { View } from "react-native";
import { Button } from "@react-navigation/elements";
import { useAuth } from "./AuthContext";

export const Logout  = () => {
const { logout } = useAuth()

    return (
        <View>
            <Button onPress={logout}>Logout</Button>
        </View>
    )
}

export default Logout