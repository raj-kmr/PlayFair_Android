// components/GameSessionCard.tsx
import { useSession } from "@/context/SessionContext";
import { useUnlock } from "@/context/UnlockContext";
import { getApiErrorMessage } from "@/lib/api/apiClient";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import UnlockRuleCard from "./unlock/UnlockRuleCard";
import AvailableTimeCard from "./unlock/AvailableTimeCard";
import UnlockProgressBar from "./unlock/UnlockProgressBar";

type Props = {
  gameId: number;
  onSessionEnded?: () => Promise<void> | void;
};

function formatDuration(totalSeconds: number) {
  const safeSeconds = Number.isFinite(totalSeconds) ? totalSeconds : 0;

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

export default function GameSessionCard({ gameId, onSessionEnded }: Props) {
  const { activeSession, elapsedSeconds, startSession, endSession } =
    useSession();

  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);

  const isCurrentGameActive = useMemo(() => {
    return activeSession?.gamesId === gameId;
  }, [activeSession, gameId]);

  const hasAnyActiveSession = !!activeSession;

  const { unlockData, refreshUnlock } = useUnlock();
  const isLocked = !unlockData || unlockData.availableMinutes <= 0;

  const handleStart = async () => {
    try {
      setStarting(true);
      await startSession(gameId);
    } catch (error) {
      Alert.alert("Error", getApiErrorMessage(error));
    } finally {
      setStarting(false);
    }
  };

  const handleEnd = async () => {
    try {
      setEnding(true);

      const endedSession = await endSession();
      await refreshUnlock();

      if (onSessionEnded) {
        await onSessionEnded();
      }

      Alert.alert(
        "Session Completed",
        `You played for ${formatDuration(endedSession?.durationSeconds || 0)}`,
      );
    } catch (error) {
      Alert.alert("Error", getApiErrorMessage(error));
    } finally {
      setEnding(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Session Tracking</Text>

      {!hasAnyActiveSession && (
        <>
          <Text style={styles.info}>
            Start a session when you begin playing this game.
          </Text>

          <Pressable
            style={[
              styles.button,
              styles.startButton,
              starting && styles.disabled,
            ]}
            onPress={handleStart}
            disabled={isLocked}
          >
            <Text style={styles.buttonText}>
              {isLocked ? "Locked 🔒" : "Start Playing"}
            </Text>
          </Pressable>
        </>
      )}

      {isLocked && (
        <Text style={{ color: "red", marginTop: 10 }}>
          No gaming time available. Complete tasks to unlock.
        </Text>
      )}
      <UnlockRuleCard/>
      <AvailableTimeCard/>
      <UnlockProgressBar/>

      {isCurrentGameActive && (
        <>
          <Text style={styles.label}>Active Session</Text>
          <Text style={styles.timer}>{formatDuration(elapsedSeconds)}</Text>

          <Pressable
            style={[
              styles.button,
              styles.stopButton,
              ending && styles.disabled,
            ]}
            onPress={handleEnd}
            disabled={ending}
          >
            <Text style={styles.buttonText}>
              {ending ? "Stopping..." : "Stop Playing"}
            </Text>
          </Pressable>
        </>
      )}

      {hasAnyActiveSession && !isCurrentGameActive && (
        <>
          <Text style={styles.info}>
            Another game session is already active.
          </Text>
          <Text style={styles.subInfo}>
            Stop that session first before starting this one.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  title: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  label: {
    color: "#555",
    fontSize: 14,
    marginBottom: 8,
  },

  info: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },

  subInfo: {
    color: "#666",
    fontSize: 13,
    lineHeight: 18,
  },

  timer: {
    color: "#000",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 14,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  startButton: {
    backgroundColor: "#2563eb",
  },

  stopButton: {
    backgroundColor: "#dc2626",
  },

  disabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
