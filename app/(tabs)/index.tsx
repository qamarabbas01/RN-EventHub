import StatCard from "@/components/Card/StatCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good Evening</Text>
            <Text style={styles.userName}>Youijero</Text>
          </View>
          <View style={styles.topBarActions}>
            <TouchableOpacity style={styles.searchIconButton}>
              <IconSymbol name="magnifyingglass" color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <IconSymbol name="bell.fill" color="#6b7280" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <IconSymbol name="magnifyingglass" color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events, bookings..."
              placeholderTextColor="#d1d5db"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <IconSymbol name="slider.horizontal.3" color="#4338ca" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerSection}>
          <Text style={styles.title}>Dashboard Overview</Text>
          <Text style={styles.subtitle}>
            Welcome back! Here is your event summary.
          </Text>
        </View>

        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.cardsGrid}>
            <StatCard
              label="Total Events"
              value={12}
              iconName="house.fill"
              trend={{
                value: "+12.5%",
                isPositive: true,
              }}
              iconBg="#e0e7ff"
              iconColor="#4338ca"
            />
            <StatCard
              label="Total Bookings"
              value={1847}
              iconName="ticket.fill"
              trend={{
                value: "+18%",
                isPositive: true,
              }}
              iconBg="#fef3c7"
              iconColor="#b45309"
            />
          </View>
        </View>

        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.cardsGrid}>
            <StatCard
              label="Revenue"
              value="$89,420"
              iconName="dollarsign.circle.fill"
              trend={{
                value: "+23%",
                isPositive: true,
              }}
              iconBg="#dcfce7"
              iconColor="#16a34a"
            />
            <StatCard
              label="Avg Attendance"
              value={77}
              iconName="person.2.fill"
              trend={{
                value: "-5%",
                isPositive: false,
              }}
              iconBg="#fee2e2"
              iconColor="#dc2626"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  greeting: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "400",
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  topBarActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  searchIconButton: {
    padding: 8,
  },
  notificationButton: {
    padding: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f9fafb",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#1f2937",
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: "#e0e7ff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  metricsSection: {
    marginBottom: 28,
  },
  performanceSection: {
    marginBottom: 16,
  },
  cardsGrid: {
    gap: 12,
  },
});
