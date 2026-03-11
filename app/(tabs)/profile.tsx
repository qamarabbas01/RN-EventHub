import SettingsSections from "@/components/SettingsSections";
import { IconSymbol } from "@/components/ui/icon-symbol";
import UserStatsGrid from "@/components/UserStatsGrid";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emailDigest, setEmailDigest] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const userData = {
    name: "Sarah Anderson",
    role: "Event Organizer",
    email: "sarah@event.pro",
    avatar: "👩‍💼",
  };

  const stats = [
    { icon: "calendar", label: "Events Created", value: "24" },
    { icon: "person.3", label: "Total Attendees", value: "2,840" },
    { icon: "star.fill", label: "Rating", value: "4.8" },
  ];

  const sections = [
    {
      title: "Notifications",
      items: [
        {
          icon: "bell.fill",
          label: "Push Notifications",
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: "envelope.fill",
          label: "Email Digest",
          value: emailDigest,
          onToggle: setEmailDigest,
        },
      ],
    },
    {
      title: "Display",
      items: [
        {
          icon: "moon.stars.fill",
          label: "Dark Mode",
          value: darkMode,
          onToggle: setDarkMode,
        },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: "key.fill", label: "Change Password", action: true as const },
        { icon: "lock.fill", label: "Privacy Settings", action: true as const },
        { icon: "doc.fill", label: "Terms & Conditions", action: true as const },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{userData.avatar}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userRole}>{userData.role}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>
            <Pressable style={styles.editButton}>
              <IconSymbol name="pencil" size={18} color="#4f46e5" />
            </Pressable>
          </View>
        </View>

        <UserStatsGrid stats={stats} />

        <SettingsSections sections={sections} />

        <Pressable style={styles.logoutButton}>
          <IconSymbol name="arrow.right.square" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>App Version 1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2026 EventHub</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffcfc",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatar: {
    fontSize: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8b5cf6",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6b7280",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ef4444",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9ca3af",
  },
});