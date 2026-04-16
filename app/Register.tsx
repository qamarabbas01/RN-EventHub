import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { toFriendlyError } from "@/utils/errors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../firebase";

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/profile");
    } catch (err: any) {
      const friendly = toFriendlyError(err, "Registration failed");
      setError(friendly.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.innerBox,
          { backgroundColor: isDark ? "#0b1220" : "#fff" },
        ]}
      >
        <View style={styles.header}>
          <Ionicons
            name="person-add"
            size={40}
            color="#2563eb"
          />

          <Text
            style={[
              styles.title,
              { color: isDark ? "#e5e7eb" : "#111827" },
            ]}
          >
            Create Account
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: isDark ? "#9ca3af" : "#6b7280" },
            ]}
          >
            Sign up to get started
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={18}
            color="#9ca3af"
            style={styles.icon}
          />

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#9ca3af"
            style={styles.icon}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color="#9ca3af"
            style={styles.icon}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color="#9ca3af"
            />
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color="#9ca3af"
            style={styles.icon}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <Pressable
          style={[
            styles.button,
            submitting && { opacity: 0.7 },
          ]}
          onPress={handleRegister}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Create Account
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.push("/Login")}
        >
          <Text style={styles.link}>
            Already have an account? Login
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  innerBox: {
    margin: 20,
    padding: 28,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 10,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  icon: {
    marginRight: 8,
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#2563eb",
  },

  error: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 10,
  },
});