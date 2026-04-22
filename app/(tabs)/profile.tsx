import SettingsSections from "@/components/SettingsSections";
import { IconSymbol } from "@/components/ui/icon-symbol";
import UserStatsGrid from "@/components/UserStatsGrid";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useColorScheme, useColorSchemePreference } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Profile() {
  const colorScheme = useColorScheme();
  const { setPreference } = useColorSchemePreference();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [eventUpdatesEnabled, setEventUpdatesEnabled] = React.useState(true);
  const [eventRemindersEnabled, setEventRemindersEnabled] = React.useState(true);
  const [newEventsEnabled, setNewEventsEnabled] = React.useState(true);

  const [userData, setUserData] = React.useState({
    name: user?.displayName || "User",
    role: "Event Organizer",
    email: user?.email || "user@example.com",
    avatar: "👤",
  });

  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editName, setEditName] = React.useState(userData.name);
  const [editRole, setEditRole] = React.useState(userData.role);
  const [editEmail, setEditEmail] = React.useState(userData.email);
  const [changePasswordVisible, setChangePasswordVisible] = React.useState(false);
  const [privacyVisible, setPrivacyVisible] = React.useState(false);
  const [termsVisible, setTermsVisible] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const stats = [
    { icon: "calendar", label: "Events Created", value: "24" },
    { icon: "person.3", label: "Total Attendees", value: "2,840" },
    { icon: "star.fill", label: "Rating", value: "4.8" },
  ];

  const handleChangePassword = () => {
    setChangePasswordVisible(true);
  };

  const handlePrivacy = () => {
    setPrivacyVisible(true);
  };

  const handleTerms = () => {
    setTermsVisible(true);
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password Changed Successfully");

    setChangePasswordVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };


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
        {
          icon: "key.fill",
          label: "Change Password",
          action: true as const,
          onPress: handleChangePassword,
        },
        {
          icon: "lock.fill",
          label: "Privacy Settings",
          action: true as const,
          onPress: handlePrivacy,
        },
        {
          icon: "doc.fill",
          label: "Terms & Conditions",
          action: true as const,
          onPress: handleTerms,
        },
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

  React.useEffect(() => {
    if (user) {
      setUserData({
        name: user.displayName || "User",
        role: "Event Organizer",
        email: user.email || "user@example.com",
        avatar: "👤",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
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

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
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

      {changePasswordVisible && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === "dark" ? "#0b1220" : "#fff" },
            ]}
          >

            <Text style={styles.modalTitle}>🔐 Change Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#9ca3af"
            />

            <View style={styles.modalActions}>

              <Pressable
                style={styles.cancelButton}
                onPress={() => setChangePasswordVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={handleSavePassword}
              >
                <Text style={styles.saveButtonText}>Update</Text>
              </Pressable>

            </View>

          </View>
        </View>
      )}
      {privacyVisible && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === "dark" ? "#0b1220" : "#fff" },
            ]}
          >

            <Text style={styles.modalTitle}>🔒 Privacy Settings</Text>

            <View style={{ gap: 12 }}>

              <View style={styles.privacyRow}>
                <Text style={styles.privacyLabel}>Profile Visibility</Text>
                <Text style={styles.privacyValue}>Public</Text>
              </View>

              <View style={styles.privacyRow}>
                <Text style={styles.privacyLabel}>Email Notifications</Text>
                <Text style={styles.privacyValue}>Enabled</Text>
              </View>

              <View style={styles.privacyRow}>
                <Text style={styles.privacyLabel}>Data Sharing</Text>
                <Text style={styles.privacyValue}>Disabled</Text>
              </View>

            </View>

            <Pressable
              style={[styles.saveButton, { marginTop: 20 }]}
              onPress={() => setPrivacyVisible(false)}
            >
              <Text style={styles.saveButtonText}>Done</Text>
            </Pressable>

          </View>
        </View>
      )}

      {termsVisible && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === "dark" ? "#0b1220" : "#fff" },
            ]}
          >

            <Text style={styles.modalTitle}>📄 Terms & Conditions</Text>

            <ScrollView style={{ maxHeight: 220 }}>

              <Text style={styles.termsText}>
                Welcome to EventHub.

                By using this app you agree to:

                {"\n\n"}• Use responsibly
                {"\n"}• Respect event organizers
                {"\n"}• Follow community guidelines
                {"\n"}• Avoid misuse

                {"\n\n"}EventHub reserves the right to suspend accounts if misuse occurs.

                {"\n\n"}Thank you for using EventHub 🎉

              </Text>

            </ScrollView>

            <Pressable
              style={[styles.saveButton, { marginTop: 15 }]}
              onPress={() => setTermsVisible(false)}
            >
              <Text style={styles.saveButtonText}>Close</Text>
            </Pressable>

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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContent: {
    width: "88%",
    borderRadius: 24,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 18,
    textAlign: "center",
    color: "#4f46e5",
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
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    marginRight: 8,
  },

  cancelButtonText: {
    fontWeight: "600",
    color: "#6b7280",
  },

  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
  },

  saveButtonText: {
    fontWeight: "700",
    color: "#fff",
  },
  privacyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },

  privacyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },

  privacyValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4f46e5",
  },

  termsText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6b7280",
  },
});