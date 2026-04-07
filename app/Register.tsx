import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../firebase";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/profile");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.innerBox, { backgroundColor: isDark ? "#0b1220" : "#fff" }]}>
        <Text style={[styles.title, { color: isDark ? "#e5e7eb" : "#111827" }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: isDark ? "#9ca3af" : "#6b7280" }]}>Sign up to get started</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
              borderColor: isDark ? "#1f2937" : "#e5e7eb",
              color: isDark ? "#e5e7eb" : "#111827",
            },
          ]}
          placeholder="Email"
          placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
              borderColor: isDark ? "#1f2937" : "#e5e7eb",
              color: isDark ? "#e5e7eb" : "#111827",
            },
          ]}
          placeholder="Password"
          placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/Login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerBox: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 16,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "#dc2626",
    marginBottom: 8,
    textAlign: "center",
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 8,
    fontSize: 15,
  },
});
