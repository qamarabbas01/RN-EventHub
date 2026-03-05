import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const chartWidth = 700;

export default function BookingTrends() {
  const data = {
    labels: [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ],
    datasets: [
      {
        data: [
          734, 978, 1120, 1250, 1380, 1500,
          1620, 1740, 1860, 1980, 2100, 2220
        ],
        strokeWidth: 3,
      },
    ],
  };

  const growth = ((1120 - 734) / 734 * 100).toFixed(1);

  return (
    <View style={styles.section}>

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Booking Trends</Text>
          <Text style={styles.subtitle}>Last 12 months performance</Text>
        </View>

        <View style={styles.growthBadge}>
          <Text style={styles.growthText}>↑ {growth}%</Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <LineChart
            data={data}
            width={chartWidth}
            height={230}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </ScrollView>
      </View>

    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',

  color: (opacity = 1) => `rgba(79,70,229,${opacity})`,
  strokeWidth: 3,

  labelColor: (opacity = 1) => `rgba(107,114,128,${opacity})`,

  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#4f46e5',
    fill: '#ffffff',
  },

  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: '#f1f5f9',
    strokeDasharray: '4,4',
  },

  decimalPlaces: 0,
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  header: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
  },

  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },

  growthBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  growthText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },

  chartWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 6,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,

    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  chart: {
    borderRadius: 16,
  },
});