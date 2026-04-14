import { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Reminder, ReminderType } from "@/lib/reminders";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Reminder | null;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const REMINDER_TYPES: { key: ReminderType; label: string; icon: string; description: string }[] = [
  { key: "session_limit",   label: "Session",   icon: "⏱", description: "Per session cap"    },
  { key: "daily_limit",    label: "Daily",     icon: "📅", description: "Daily usage limit"   },
  { key: "break_reminder", label: "Break",     icon: "☕", description: "Rest intervals"      },
  { key: "game_time",      label: "Game Time", icon: "🎮", description: "Scheduled play slot"  },
];

const { width } = Dimensions.get("window");

// ─── Dialer Component ─────────────────────────────────────────────────────────

interface DialerProps {
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  pad?: boolean;
  onChange: (v: number) => void;
}

function Dialer({ value, unit, min, max, step = 1, pad = false, onChange }: DialerProps) {
  const pressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const increment = useCallback(() => {
    onChange(value + step > max ? min : value + step);
  }, [value, step, max, min, onChange]);

  const decrement = useCallback(() => {
    onChange(value - step < min ? max : value - step);
  }, [value, step, min, max, onChange]);

  const startRepeat = (fn: () => void) => {
    fn();
    pressTimer.current = setInterval(fn, 120);
  };

  const stopRepeat = () => {
    if (pressTimer.current) {
      clearInterval(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const display = pad ? String(value).padStart(2, "0") : String(value);

  return (
    <View style={dialerStyles.container}>
      <TouchableOpacity
        style={dialerStyles.btn}
        onPressIn={() => startRepeat(increment)}
        onPressOut={stopRepeat}
        activeOpacity={0.6}
      >
        <Text style={dialerStyles.arrow}>▲</Text>
      </TouchableOpacity>

      <View style={dialerStyles.display}>
        <Text style={dialerStyles.number}>{display}</Text>
        <Text style={dialerStyles.unit}>{unit}</Text>
      </View>

      <TouchableOpacity
        style={dialerStyles.btn}
        onPressIn={() => startRepeat(decrement)}
        onPressOut={stopRepeat}
        activeOpacity={0.6}
      >
        <Text style={dialerStyles.arrow}>▼</Text>
      </TouchableOpacity>
    </View>
  );
}

const dialerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EBEBEB",
    alignItems: "center",
    overflow: "hidden",
  },
  btn: {
    width: "100%",
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: 11,
    color: "#BBBBBB",
  },
  display: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EBEBEB",
  },
  number: {
    fontSize: 28,
    fontWeight: "500",
    color: "#111111",
    lineHeight: 32,
  },
  unit: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#BBBBBB",
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function ReminderFormModal({ visible, onClose, onSubmit, initialData }: Props) {
  const [type, setType]                 = useState<ReminderType>("session_limit");
  const [durationHrs, setDurationHrs]   = useState(0);
  const [durationMins, setDurationMins] = useState(30);
  const [scheduleHr, setScheduleHr]     = useState(22);
  const [scheduleMin, setScheduleMin]   = useState(0);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const slideAnim = useRef(new Animated.Value(80)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 70, friction: 11 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 80, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,  duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (initialData) {
      setType(initialData.reminder_type);
      const totalMins = initialData.reminder_value ?? 30;
      setDurationHrs(Math.floor(totalMins / 60));
      setDurationMins(totalMins % 60);
      if (initialData.scheduled_time) {
        const [h, m] = initialData.scheduled_time.split(":").map(Number);
        setScheduleHr(h ?? 22);
        setScheduleMin(m ?? 0);
      }
      setSelectedDays(initialData.scheduled_days || []);
    } else {
      setType("session_limit");
      setDurationHrs(0);
      setDurationMins(30);
      setScheduleHr(22);
      setScheduleMin(0);
      setSelectedDays([]);
    }
  }, [initialData, visible]);

  const toggleDay = (day: string) =>
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );

  const handleSubmit = () => {
    const totalMinutes = durationHrs * 60 + durationMins;
    if (totalMinutes <= 0) {
      Alert.alert("Invalid Duration", "Please set a duration greater than 0 minutes.");
      return;
    }
    const timeStr = `${String(scheduleHr).padStart(2, "0")}:${String(scheduleMin).padStart(2, "0")}`;
    onSubmit({
      reminderType:  type,
      reminderValue: totalMinutes,
      scheduledTime: type === "game_time" ? timeStr : null,
      scheduledDays: type === "game_time" && selectedDays.length > 0 ? selectedDays : null,
    });
    onClose();
  };

  const isGameTime = type === "game_time";
  const isEditing  = !!initialData;

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>{isEditing ? "EDITING" : "NEW REMINDER"}</Text>
                <Text style={styles.title}>{isEditing ? "Update Reminder" : "Create Reminder"}</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Type selection */}
            <Text style={styles.sectionLabel}>Reminder Type</Text>
            <View style={styles.typeGrid}>
              {REMINDER_TYPES.map((t) => {
                const active = type === t.key;
                return (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setType(t.key)}
                    style={[styles.typeCard, active && styles.typeCardActive]}
                    activeOpacity={0.75}
                  >
                    {active && <View style={styles.typeActiveDot} />}
                    <Text style={styles.typeIcon}>{t.icon}</Text>
                    <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{t.label}</Text>
                    <Text style={[styles.typeDesc,  active && styles.typeDescActive]}>{t.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Duration dialers */}
            <Text style={styles.sectionLabel}>Duration</Text>
            <View style={styles.dialerRow}>
              <View style={styles.dialerBlock}>
                <Text style={styles.dialerBlockLabel}>HOURS</Text>
                <Dialer
                  value={durationHrs}
                  unit="HRS"
                  min={0}
                  max={23}
                  step={1}
                  pad={false}
                  onChange={setDurationHrs}
                />
              </View>
              <View style={styles.dialerBlock}>
                <Text style={styles.dialerBlockLabel}>MINUTES</Text>
                <Dialer
                  value={durationMins}
                  unit="MIN"
                  min={0}
                  max={55}
                  step={5}
                  pad={true}
                  onChange={setDurationMins}
                />
              </View>
            </View>

            {/* Game Time extras */}
            {isGameTime && (
              <>
                <Text style={styles.sectionLabel}>Scheduled Time</Text>
                <View style={styles.timeRow}>
                  <View style={styles.timeDialerBlock}>
                    <Text style={styles.dialerBlockLabel}>HOUR</Text>
                    <Dialer
                      value={scheduleHr}
                      unit="24H"
                      min={0}
                      max={23}
                      step={1}
                      pad={true}
                      onChange={setScheduleHr}
                    />
                  </View>
                  <Text style={styles.colon}>:</Text>
                  <View style={styles.timeDialerBlock}>
                    <Text style={styles.dialerBlockLabel}>MINUTE</Text>
                    <Dialer
                      value={scheduleMin}
                      unit="MIN"
                      min={0}
                      max={55}
                      step={5}
                      pad={true}
                      onChange={setScheduleMin}
                    />
                  </View>
                </View>

                <Text style={styles.sectionLabel}>Repeat On</Text>
                <View style={styles.daysRow}>
                  {DAYS.map((day, i) => {
                    const active = selectedDays.includes(day);
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDay(day)}
                        style={[styles.dayChip, active && styles.dayChipActive]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                          {DAY_LABELS[i]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.7}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn} activeOpacity={0.85}>
                <Text style={styles.saveText}>{isEditing ? "Update" : "Create"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.30)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    marginTop: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#6C8EBF",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  closeIcon: {
    color: "#888888",
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 22,
  },

  // Labels
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#AAAAAA",
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  dialerBlockLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#BBBBBB",
    marginBottom: 6,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  // Type grid
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 26,
  },
  typeCard: {
    width: (width - 68) / 2,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#EBEBEB",
    position: "relative",
    overflow: "hidden",
  },
  typeCardActive: {
    backgroundColor: "#EFF5FF",
    borderColor: "#4A90E2",
  },
  typeActiveDot: {
    position: "absolute",
    top: 11,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#4A90E2",
  },
  typeIcon: {
    fontSize: 20,
    marginBottom: 7,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 3,
  },
  typeLabelActive: {
    color: "#1A5CB0",
  },
  typeDesc: {
    fontSize: 11,
    color: "#BBBBBB",
    lineHeight: 14,
  },
  typeDescActive: {
    color: "#6C8EBF",
  },

  // Dialers
  dialerRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 26,
  },
  dialerBlock: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 26,
  },
  timeDialerBlock: {
    flex: 1,
  },
  colon: {
    fontSize: 28,
    fontWeight: "400",
    color: "#CCCCCC",
    paddingBottom: 28,
  },

  // Days
  daysRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 26,
    flexWrap: "wrap",
  },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    borderWidth: 1.5,
    borderColor: "#EBEBEB",
    alignItems: "center",
    justifyContent: "center",
  },
  dayChipActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#BBBBBB",
    letterSpacing: 0.5,
  },
  dayChipTextActive: {
    color: "#FFFFFF",
  },

  // Actions
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EBEBEB",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#888888",
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  saveText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
