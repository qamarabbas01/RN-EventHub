import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const chartWidth = 700;

export default function RevenueOverview() {
  const data = {
    labels: ['Jan','Feb','Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [100,500, 0, 2500, 3000, 2500, 2800, 3200, 3500, 3800, 4000, 3600],
      },
    ],
  };

  const totalRevenue = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  const formattedTotal = `$${(totalRevenue / 1000).toFixed(0)}K`;

  return (
    <View style={styles.section}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <Text style={styles.subtitle}>Monthly earnings breakdown</Text>
        </View>

        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{formattedTotal}</Text>
          <Text style={styles.totalLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={data}
            width={chartWidth}
            height={300}
            chartConfig={chartConfig}
            verticalLabelRotation={35}
            yAxisLabel="$"
            yAxisSuffix=""
            showValuesOnTopOfBars={false}
            withInnerLines
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

  color: (opacity = 1) => `rgba(124,58,237,${opacity})`,
  labelColor: (opacity = 1) => `rgba(107,114,128,${opacity})`,

  propsForBackgroundLines: {
    stroke: '#f1f5f9',
    strokeDasharray: '4,4',
  },

  fillShadowGradient: '#7c3aed',
  fillShadowGradientOpacity: 0.35,

  decimalPlaces: 0,
  barPercentage: 0.55,
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

  totalBadge: {
    backgroundColor: '#faf5ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    alignItems: 'center',
  },

  totalText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#7c3aed',
  },

  totalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#a855f7',
    marginTop: 1,
  },

  chartWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
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