import SettingsSections from "@/components/SettingsSections";
import { IconSymbol } from "@/components/ui/icon-symbol";
import UserStatsGrid from "@/components/UserStatsGrid";
import { Colors } from "@/constants/theme";
import { useColorScheme, useColorSchemePreference } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Profile() {
  const colorScheme = useColorScheme();
  const { setPreference } = useColorSchemePreference();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [eventUpdatesEnabled, setEventUpdatesEnabled] = React.useState(true);
  const [eventRemindersEnabled, setEventRemindersEnabled] = React.useState(true);
  const [newEventsEnabled, setNewEventsEnabled] = React.useState(true);

  const [userData, setUserData] = React.useState({
    name: "Ahmed Khan",
    role: "Event Organizer",
    email: "ahmed@event.pro",
    avatar: "👤",
  });

  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editName, setEditName] = React.useState(userData.name);
  const [editRole, setEditRole] = React.useState(userData.role);
  const [editEmail, setEditEmail] = React.useState(userData.email);

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
          label: "Enable Notifications",
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: "arrow.triangle.2.circlepath",
          label: "Event Updates",
          value: notificationsEnabled && eventUpdatesEnabled,
          onToggle: (value: boolean) => {
            setEventUpdatesEnabled(value);
            if (value) setNotificationsEnabled(true);
          },
        },
        {
          icon: "clock.fill",
          label: "Event Reminders",
          value: notificationsEnabled && eventRemindersEnabled,
          onToggle: (value: boolean) => {
            setEventRemindersEnabled(value);
            if (value) setNotificationsEnabled(true);
          },
        },
        {
          icon: "sparkles",
          label: "New Event Alerts",
          value: notificationsEnabled && newEventsEnabled,
          onToggle: (value: boolean) => {
            setNewEventsEnabled(value);
            if (value) setNotificationsEnabled(true);
          },
        },
      ],
    },
    {
      title: "Display",
      items: [
        {
          icon: "moon.stars.fill",
          label: "Dark Mode",
          value: colorScheme === "dark",
          onToggle: (enabled: boolean) => setPreference(enabled ? "dark" : "light"),
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

  const handleEditPress = () => {
    setEditName(userData.name);
    setEditRole(userData.role);
    setEditEmail(userData.email);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    setUserData((prev) => ({
      ...prev,
      name: editName,
      role: editRole,
      email: editEmail,
    }));
    setEditModalVisible(false);
  };

  const handleLogout = () => {
    router.navigate("/Login");
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: colorScheme === "dark" ? "#0b1220" : "#fff",
                borderColor: colorScheme === "dark" ? "#111827" : "#f3f4f6",
                shadowOpacity: colorScheme === "dark" ? 0.25 : 0.06,
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{userData.avatar}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.userName,
                  { color: colorScheme === "dark" ? "#e5e7eb" : "#111827" },
                ]}
              >
                {userData.name}
              </Text>
              <Text style={styles.userRole}>{userData.role}</Text>
              <Text
                style={[
                  styles.userEmail,
                  { color: colorScheme === "dark" ? "#9ca3af" : "#6b7280" },
                ]}
              >
                {userData.email}
              </Text>
            </View>
            <Pressable style={styles.editButton} onPress={handleEditPress}>
              <IconSymbol name="pencil" size={18} color="#4f46e5" />
            </Pressable>
          </View>
        </View>

        <UserStatsGrid stats={stats} />

        <SettingsSections sections={sections} />

        <Pressable style={styles.logoutButton} onPress={() => handleLogout()}>
          <IconSymbol name="arrow.right.square" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>App Version 1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2026 EventHub</Text>
        </View>
      </ScrollView>

      {editModalVisible && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === "dark" ? "#0b1220" : "#fff" },
            ]}
          >
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colorScheme === "dark" ? "#0f172a" : "#f9fafb",
                    borderColor: colorScheme === "dark" ? "#1f2937" : "#e5e7eb",
                    color: colorScheme === "dark" ? "#e5e7eb" : "#111827",
                  },
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Name"
                placeholderTextColor={colorScheme === "dark" ? "#6b7280" : "#9ca3af"}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colorScheme === "dark" ? "#0f172a" : "#f9fafb",
                    borderColor: colorScheme === "dark" ? "#1f2937" : "#e5e7eb",
                    color: colorScheme === "dark" ? "#e5e7eb" : "#111827",
                  },
                ]}
                value={editRole}
                onChangeText={setEditRole}
                placeholder="Role"
                placeholderTextColor={colorScheme === "dark" ? "#6b7280" : "#9ca3af"}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colorScheme === "dark" ? "#0f172a" : "#f9fafb",
                    borderColor: colorScheme === "dark" ? "#1f2937" : "#e5e7eb",
                    color: colorScheme === "dark" ? "#e5e7eb" : "#111827",
                  },
                ]}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colorScheme === "dark" ? "#6b7280" : "#9ca3af"}
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: 6,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});