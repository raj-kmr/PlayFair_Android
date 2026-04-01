import { FlatList } from "react-native";
import type { IgdbGame } from "../hooks/useIgdbSearch";
import { IgdbResultItem } from "./IgdbResultItem";

type IgdbSearchResultsProps = {
  data: IgdbGame[];
  onAddPress: (item: IgdbGame) => void;
  visible: boolean;
};

export function IgdbSearchResults({
  data,
  onAddPress,
  visible,
}: IgdbSearchResultsProps) {
  if (!visible) return null;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.igdbId)}
      contentContainerStyle={{ gap: 10 }}
      renderItem={({ item }) => (
        <IgdbResultItem item={item} onAdd={onAddPress} />
      )}
    />
  );
}
