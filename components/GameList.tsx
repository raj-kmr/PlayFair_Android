import { FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import GameCard, { GameCardItem } from "./GameCard";

type Props = {
    games: GameCardItem[],
    refreshing?: boolean,
    onRefresh?: () => void,
    onDelete?: (id: GameCardItem["id"]) => void,
    emptyText?: string
}

export default function GameList({games, refreshing = false, onRefresh, onDelete, emptyText ="No games yet. Search and add your first game."}: Props) {
    return (
        <FlatList data={games} keyExtractor={(item) => String(item.id)} refreshControl={
            onRefresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
            ) : undefined
        }
            contentContainerStyle={games.length ? styles.list : styles.emptyWrap}
            ListEmptyComponent={<Text style={styles.emptyText}>{emptyText}</Text>}
            renderItem={({item}) => <GameCard item={item} onDelete={onDelete}/>}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        paddingBottom: 24
    }, 
    emptyWrap: {
        flexGrow: 1,
        justifyContent: "center"
    }, 
    emptyText: {
        textAlign: "center",
        opacity: 0.7
    }
})