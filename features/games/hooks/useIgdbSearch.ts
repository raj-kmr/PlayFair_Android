import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { addIgdbGame } from "../games.service";
import { searchIgdb } from "@/features/igdb/igdb.service";
import { getApiErrorMessage } from "@/lib/api/apiClient";

type IgdbGame = {
  igdbId: number;
  name: string;
  imageUrl?: string | null;
  description?: string | null;
};

export function useIgdbSearch(onGameAdded: () => void) {
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [igdbResults, setIgdbResults] = useState<IgdbGame[]>([]);
  const [selectedIgdb, setSelectedIgdb] = useState<IgdbGame | null>(null);
  const [addIgdbOpen, setAddIgdbOpen] = useState(false);
  const [playedBefore, setPlayedBefore] = useState<boolean | null>(null);
  const [playedHoursInput, setPlayedHoursInput] = useState("");
  const [addIgdb, setAddIgdb] = useState(false);

  const searchSeq = useRef(0);
  const q = searchText.trim();

  const normalizeIgdbImage = useCallback((url?: string | null) => {
    if (!url) return null;
    return url.startsWith("//") ? `https:${url}` : url;
  }, []);

  const convertHoursToMinutes = (hoursInput: string) => {
    const hours = Number(hoursInput);
    if (!Number.isFinite(hours) || hours < 0) {
      return undefined;
    }
    return Math.round(hours * 60);
  };

  const openIgdbAddFlow = useCallback((item: IgdbGame) => {
    setSelectedIgdb(item);
    setPlayedBefore(null);
    setPlayedHoursInput("");
    setAddIgdbOpen(true);
  }, []);

  const closeIgdbAddFlow = useCallback(() => {
    setSelectedIgdb(null);
    setAddIgdbOpen(false);
    setPlayedBefore(null);
    setPlayedHoursInput("");
  }, []);

  const onConfirmAddIgdb = useCallback(async () => {
    if (!selectedIgdb) return;

    if (playedBefore === null) {
      Alert.alert("Select Yes or No");
      return;
    }

    let minutes = 0;

    if (playedBefore === true) {
      const m = convertHoursToMinutes(playedHoursInput);

      if (m === undefined) {
        Alert.alert("Invalid Playtime", "Hours must be 0 or more");
        return;
      }
      minutes = m;
    }

    try {
      setAddIgdb(true);

      await addIgdbGame({
        igdbId: selectedIgdb.igdbId,
        name: selectedIgdb.name,
        imageUrl: normalizeIgdbImage(selectedIgdb.imageUrl) ?? null,
        description: selectedIgdb.description ?? null,
        playedBefore,
        initialPlaytimeMinutes: minutes,
      });

      closeIgdbAddFlow();
      setSearchText("");
      setIgdbResults([]);
      onGameAdded();
    } catch (err) {
      Alert.alert("Error", getApiErrorMessage(err));
    } finally {
      setAddIgdb(false);
    }
  }, [
    selectedIgdb,
    playedBefore,
    playedHoursInput,
    closeIgdbAddFlow,
    normalizeIgdbImage,
    onGameAdded,
  ]);

  useEffect(() => {
    const query = searchText.trim();

    if (query.length < 2) {
      setIgdbResults([]);
      setSearching(false);
      return;
    }

    const t = setTimeout(async () => {
      const seq = ++searchSeq.current;

      try {
        setSearching(true);
        const data = await searchIgdb(query);

        if (seq !== searchSeq.current) return;

        setIgdbResults(
          data.map((g) => ({
            ...g,
            imageUrl: normalizeIgdbImage(g.imageUrl),
          })),
        );
      } catch (err) {
        if (seq == searchSeq.current) {
          Alert.alert("Error", getApiErrorMessage(err));
          setIgdbResults([]);
        }
      } finally {
        if (seq === searchSeq.current) setSearching(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [searchText, normalizeIgdbImage]);

  return {
    searchText,
    setSearchText,
    searching,
    igdbResults,
    selectedIgdb,
    addIgdbOpen,
    playedBefore,
    setPlayedBefore,
    playedHoursInput,
    setPlayedHoursInput,
    addIgdb,
    q,
    openIgdbAddFlow,
    closeIgdbAddFlow,
    onConfirmAddIgdb,
    normalizeIgdbImage,
  };
}

export type { IgdbGame };
