import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface Props {
  selectedRange: '7d' | '30d';
  onRangeChange: (range: '7d' | '30d') => void;
}

const TimeRangeSelector: React.FC<Props> = ({ selectedRange, onRangeChange }) => {
  const handleRangeChange = (range: '7d' | '30d') => {
    onRangeChange(range);
  };

  return (
    <View style={styles.selectorContainer}>
      <TouchableOpacity onPress={() => handleRangeChange('7d')} activeOpacity={0.7}>
        <Text style={[styles.rangeText, selectedRange === '7d' && styles.selectedRange]}>
          7 Days
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRangeChange('30d')} activeOpacity={0.7}>
        <Text style={[styles.rangeText, selectedRange === '30d' && styles.selectedRange]}>
          30 Days
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rangeText: {
    fontSize: 14,
    color: '#94a3b8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectedRange: {
    color: '#f1f5f9',
    fontWeight: '700',
    backgroundColor: '#334155',
    borderRadius: 6,
  },
});

export default TimeRangeSelector;