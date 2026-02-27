import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;

export default function RevenueOverview() {
  const data = {
    labels: ['2024', '2025', '2026'],
    datasets: [
      {
        data: [171000, 342000, 20000],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        style={styles.chart}
      />
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`, // purple
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  chart: {
    borderRadius: 16,
  },
});