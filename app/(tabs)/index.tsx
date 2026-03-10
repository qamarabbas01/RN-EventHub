import BookingTrends from "@/components/BookingTrends";
import MetricsSection from "@/components/MetricsSection";
import RevenueOverview from "@/components/RevenueOverview";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [greeting, setGreeting] = useState("Good Evening");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
          <Link href="/notification" style={styles.topBarActions}>
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.6}
            >
              <Link href="/notification">
                <IconSymbol name="bell.fill" color="#6b7280" />
              </Link>
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </Link> 
        </Animated.View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <IconSymbol name="magnifyingglass" color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events, bookings..."
              placeholderTextColor="#d1d5db"
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={0.7}
          >
            <IconSymbol name="slider.horizontal.3" color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerSection}>
          <Text style={styles.title}>Welcome back, John Doe!</Text>
          <Text style={styles.subtitle}>
            Your event & booking overview
          </Text>
        </View>

        <MetricsSection
          title="Key Metrics"
          viewAllIcon={<IconSymbol name="arrow.forward" size={12} color="#4338ca" />}
          viewAllLink={'(tabs)/attendee-insights'}
          viewAlllabel="View All"
          cards={[
            {
              label: "Total Events",
              value: 12,
              trend: {
                value: "+12.5%",
                isPositive: true,
              },
            },
            {
              label: "Total Bookings",
              value: 1847,
              trend: {
                value: "+18%",
                isPositive: true,
              },
            },
          ]}
        />

        <MetricsSection
          title="Performance"
          cards={[
            {
              label: "Revenue",
              value: "$89,420",
              trend: {
                value: "+23%",
                isPositive: true,
              },
            },
            {
              label: "Avg Attendance",
              value: 77,
              trend: {
                value: "-5%",
                isPositive: false,
              },
            },
          ]}
        />
        <BookingTrends />
        <RevenueOverview />
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
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  greeting: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
  },
  topBarActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  searchIconButton: {
    padding: 8,
    borderRadius: 10,
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
    borderWidth: 2.5,
    borderColor: "#f9fafb",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    alignItems: "center",
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#1f2937",
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: "#4338ca",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4338ca",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    fontWeight: "500",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 16,
  },
  metricsSection: {
    marginBottom: 28,
  },
  performanceSection: {
    marginBottom: 16,
  },
});
