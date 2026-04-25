import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { toFriendlyError } from "@/utils/errors";
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  price?: string;
  imageUrl?: string;
  image?: string;
  featured?: boolean;
  [key: string]: any;
};

const eventCategories = [
  { label: "Music", icon: "🎵" },
  { label: "Business", icon: "💼" },
  { label: "Workshop", icon: "🎓" },
  { label: "Sports", icon: "⚽" },
  { label: "Food", icon: "🍔" },
  { label: "Festival", icon: "🎭" },
];

function isUpcoming(date: string) {
  const now = new Date();
  const d = new Date(date);
  return d > now;
}
function isNearby(location: string) {
  return true;
}


export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const isDark = colorScheme === "dark";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(eventsData);
      } catch (error) {
        const friendly = toFriendlyError(error, 'Couldn’t load events');
        setLoadError(friendly.message);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <LinearGradient
          colors={["#6366f1", "#a5b4fc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Hello {user?.displayName || user?.email?.split('@')[0] || 'Guest'}</Text>
              <Text style={styles.headerTitle}>
                Discover Events Around You
              </Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={[
                  styles.headerIconBtn,
                  { backgroundColor: isDark ? "#f5f5f5" : "#fff" },
                ]}
              >
                <Link href="/notification">
                  <IconSymbol name="bell.fill" size={24} color="#4f46e5" />
                </Link>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.headerIconBtn,
                  { backgroundColor: isDark ? "#0b1220" : "#fff" },
                ]}
                accessibilityRole="imagebutton"
                accessibilityLabel="Open profile"
                activeOpacity={0.85}
                onPress={() => router.push("/profile")}
              >
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.profilePic}
                    accessibilityIgnoresInvertColors
                    accessibilityLabel="Profile photo"
                  />
                ) : (
                  <Image
                    source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
                    style={styles.profilePic}
                    accessibilityIgnoresInvertColors
                    accessibilityLabel="Profile photo"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.searchBarSection}>
            <View
              style={[
                styles.searchInputWrapper,
                {
                  backgroundColor: isDark ? "#0b1220" : "#fff",
                  borderColor: isDark ? "#111827" : "#e2e8f0",
                },
              ]}
            >
              <IconSymbol name="magnifyingglass" color="#9ca3af" />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: isDark ? "#e5e7eb" : "#1e293b" },
                ]}
                placeholder="Search events, concerts, workshops..."
                placeholderTextColor={isDark ? "#6b7280" : "#d1d5db"}
                accessibilityLabel="Search events"
              />
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionSpacing}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#e5e7eb" : "#000" }]}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesRow}>
              {eventCategories.map((cat) => (
                <LinearGradient
                  key={cat.label}
                  colors={["#a5b4fc", "#6366f1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryBtn}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </LinearGradient>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionSpacing}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#e5e7eb" : "#000" }]}>
            Featured Events
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.featuredRow}>
              {loading ? (
                <View style={{ width: 200, height: 110, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator color={isDark ? "#a5b4fc" : "#4f46e5"} />
                  <Text style={{ marginTop: 8, color: isDark ? "#9ca3af" : "#111827", fontWeight: '600' }}>
                    Loading events…
                  </Text>
                </View>
              ) : (
                events
                  .filter(e => e.featured)
                  .map((event, idx) => (
                    <Pressable
                      key={event.id || idx}
                      style={[
                        styles.featuredCard,
                        { backgroundColor: isDark ? "#0b1220" : "#fff" },
                      ]}
                      onPress={() => {
                        router.push(`/events/${event.id}`);
                      }}
                    >
                      <Image source={{ uri: event.imageUrl || event.image }} style={styles.featuredImg} />
                      <LinearGradient
                        colors={["rgba(99,102,241,0.7)", "rgba(255,255,255,0.1)"]}
                        style={styles.featuredOverlay}
                      />
                      <View style={styles.featuredContent}>
                        <Text style={[styles.featuredTitle, { color: isDark ? "#e5e7eb" : "#1e293b" }]}>
                          {event.title}
                        </Text>
                        <Text style={[styles.featuredMeta, { color: isDark ? "#9ca3af" : "#64748b" }]}>
                          {event.date} • {event.location}
                        </Text>
                        <Text style={styles.featuredPrice}>{event.price}</Text>
                      </View>
                    </Pressable>
                  ))
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionSpacing}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#e5e7eb" : "#000" }]}>
            Upcoming Events
          </Text>
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <ActivityIndicator color={isDark ? "#a5b4fc" : "#4f46e5"} />
              <Text style={{ marginTop: 8, color: isDark ? "#9ca3af" : "#111827", fontWeight: '600' }}>
                Loading events…
              </Text>
            </View>
          ) : (
            events
              .filter(e => isUpcoming(e.date))
              .map((event, idx) => (
                <Pressable
                  key={event.id || idx}
                  onPress={() => {
                    router.push(`/events/${event.id}`);
                  }}
                  style={[
                    styles.upcomingCard,
                    { backgroundColor: isDark ? "#0b1220" : "#fff" },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`View details for ${event.title}`}
                >
                  <View style={styles.upcomingAccent} />
                  <View style={styles.upcomingContent}>
                    <Text style={[styles.upcomingTitle, { color: isDark ? "#e5e7eb" : "#1e293b" }]}>
                      {event.title}
                    </Text>
                    <Text style={[styles.upcomingMeta, { color: isDark ? "#9ca3af" : "#64748b" }]}>
                      {event.date} • {event.location}
                    </Text>
                  </View>
                </Pressable>
              ))
          )}
        </View>

        <View style={styles.sectionSpacing}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#e5e7eb" : "#000" }]}>
            Events Near You
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.featuredRow}>
              {loading ? (
                <View style={{ width: 220, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator color={isDark ? "#a5b4fc" : "#4f46e5"} />
                  <Text style={{ marginTop: 8, color: isDark ? "#9ca3af" : "#111827", fontWeight: '600' }}>
                    Loading events…
                  </Text>
                </View>
              ) : (
                events
                  .filter(e => isNearby(e.location))
                  .map((event, idx) => (
                    <Pressable
                      key={event.id || idx}
                      style={[
                        styles.nearbyCard,
                        { backgroundColor: isDark ? "#0b1220" : "#fff" },
                      ]}
                      onPress={() => {
                        router.push(`/events/${event.id}`);
                      }}
                    >
                      <Image source={{ uri: event.imageUrl || event.image }} style={styles.nearbyImg} />
                      <View style={styles.nearbyContent}>
                        <Text style={[styles.nearbyTitle, { color: isDark ? "#e5e7eb" : "#1e293b" }]}>
                          {event.title}
                        </Text>
                        <Text style={[styles.nearbyMeta, { color: isDark ? "#9ca3af" : "#64748b" }]}>
                          {event.location}
                        </Text>
                      </View>
                    </Pressable>
                  ))
              )}
            </View>
          </ScrollView>
        </View>

        <Pressable
            style={styles.sectionSpacing}
            onPress={() => router.push('/(tabs)/my-tickets')}
        >
          <LinearGradient
            colors={["#6366f1", "#a5b4fc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ticketsCard}
          >
            <Text style={styles.ticketsIcon}>🎟</Text>
            <View>
              <Text style={styles.ticketsTitle}>My Tickets</Text>
              <Text style={styles.ticketsSubtitle}>View your booked events</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerGradient: {
    borderRadius: 28,
    marginBottom: 18,
    padding: 0,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 28,
    backgroundColor: 'transparent',
  },
  greeting: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 2,
    textShadowColor: "#6366f1",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 0,
    textShadowColor: "#6366f1",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  headerIconBtn: {
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  searchBarSection: {
    marginBottom: 18,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  sectionSpacing: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  categoriesRow: {
    flexDirection: "row",
    gap: 12,
  },
  categoryBtn: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginRight: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "#6366f1",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuredRow: {
    flexDirection: "row",
    gap: 18,
  },
  featuredCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    marginRight: 16,
    width: 200,
    padding: 0,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  featuredImg: {
    width: "100%",
    height: 110,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },
  featuredContent: {
    padding: 14,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 2,
  },
  featuredMeta: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 2,
  },
  featuredPrice: {
    fontSize: 14,
    color: "#22c55e",
    fontWeight: "800",
  },
  upcomingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    marginBottom: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  upcomingAccent: {
    width: 6,
    height: "100%",
    backgroundColor: "#6366f1",
  },
  upcomingContent: {
    padding: 16,
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 2,
  },
  upcomingMeta: {
    fontSize: 13,
    color: "#64748b",
  },
  nearbyCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    marginRight: 16,
    width: 220,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
  },
  nearbyImg: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  nearbyContent: {
    padding: 16,
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 2,
  },
  nearbyMeta: {
    fontSize: 13,
    color: "#64748b",
  },
  ticketsCard: {
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 16,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 8,
  },
  ticketsIcon: {
    fontSize: 32,
    marginRight: 10,
    color: "#fff",
    textShadowColor: "#6366f1",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ticketsTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#fff",
  },
  ticketsSubtitle: {
    fontSize: 14,
    color: "#e0e7ff",
  },
});
