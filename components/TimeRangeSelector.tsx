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
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 10,
  },
  rangeText: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedRange: {
    color: '#000',
    fontWeight: '600',
    backgroundColor: '#e0f7fa',
    borderRadius: 4,
  },
});

export default TimeRangeSelector;