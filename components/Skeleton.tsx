import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

interface Props {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
}

const Skeleton = ({
  width = 200,
  height = 16,
  borderRadius = 8,
  margin = 0,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
}: Props) => {
  const [translateX, setTranslateX] = useState(-200);

  useEffect(() => {
    const animation = setInterval(() => {
      setTranslateX((prev) => (prev > 1200 ? -200 : prev + 50));
    }, 16);

    return () => clearInterval(animation);
  }, []);

  const styleProps = {
    width: typeof width === 'number' ? width : width,
    height: typeof height === 'number' ? height : height,
    borderRadius,
    ...(typeof margin === 'number' ? { margin } : margin || {}),
    marginBottom: marginBottom ?? (typeof margin === 'number' ? margin : 0),
    marginTop: marginTop ?? (typeof margin === 'number' ? margin : 0),
    marginLeft: marginLeft ?? (typeof margin === 'number' ? margin : 0),
    marginRight: marginRight ?? (typeof margin === 'number' ? margin : 0),
    overflow: 'hidden' as const,
  };

  return (
    <View
      style={[
        styles.skeletonContainer,
        styleProps,
      ]}
    >
      <View
        style={[
          styles.skeletonContent,
          {
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            borderRadius,
            position: 'absolute',
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    backgroundColor: '#e0e0e0',
  },
  skeletonContent: {
    backgroundColor: '#fff',
  },
});

export default Skeleton;