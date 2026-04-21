import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { toFriendlyError } from "@/utils/errors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setError("");
    try {
      setSubmitting(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/profile");
    } catch (err: any) {
      const friendly = toFriendlyError(err, "Login failed");
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
            name="lock-closed"
            size={40}
            color="#2563eb"
          />
          <Text
            style={[
              styles.title,
              { color: isDark ? "#e5e7eb" : "#111827" },
            ]}
          >
            Welcome Back
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: isDark ? "#9ca3af" : "#6b7280" },
            ]}
          >
            Sign in to continue
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#9ca3af"
            style={styles.icon}
          />
          <TextInput
            style={[
              styles.input,
              {
                color: isDark ? "#e5e7eb" : "#111827",
              },
            ]}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!submitting}
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
            style={[
              styles.input,
              {
                color: isDark ? "#e5e7eb" : "#111827",
              },
            ]}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!submitting}
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

        <Pressable
          style={styles.forgot}
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </Pressable>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <Pressable
          style={[
            styles.button,
            submitting && { opacity: 0.7 },
          ]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Sign In
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.push("/Register")}
        >
          <Text style={styles.link}>
            Don&apos;t have an account? Register
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
    marginBottom: 30,
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

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  forgot: {
    alignItems: "flex-end",
    marginBottom: 10,
  },

  forgotText: {
    color: "#2563eb",
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: "600",
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
