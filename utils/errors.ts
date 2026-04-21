type AnyError = unknown;

function getErrorCode(err: AnyError): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const maybe = err as { code?: unknown };
  return typeof maybe.code === "string" ? maybe.code : undefined;
}

function getErrorMessage(err: AnyError): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const maybe = err as { message?: unknown };
  return typeof maybe.message === "string" ? maybe.message : undefined;
}

export type FriendlyError = {
  title: string;
  message: string;
  retryable?: boolean;
};

export function toFriendlyError(
  err: AnyError,
  fallbackTitle = "Something went wrong",
): FriendlyError {
  const code = getErrorCode(err);

  // Firebase Auth (common cases)
  switch (code) {
    case "auth/invalid-email":
      return {
        title: "Check your email",
        message: "That email address doesn’t look valid. Please try again.",
      };
    case "auth/missing-email":
      return {
        title: "Email required",
        message: "Please enter your email address.",
      };
    case "auth/missing-password":
      return {
        title: "Password required",
        message: "Please enter your password.",
      };
    case "auth/weak-password":
      return {
        title: "Choose a stronger password",
        message: "Use at least 6 characters for your password.",
      };
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return {
        title: "Sign-in failed",
        message: "Email or password is incorrect. Please try again.",
      };
    case "auth/email-already-in-use":
      return {
        title: "Email already in use",
        message: "Try logging in instead, or use a different email.",
      };
    case "auth/too-many-requests":
      return {
        title: "Try again later",
        message: "Too many attempts. Please wait a bit and try again.",
      };
    case "auth/network-request-failed":
      return {
        title: "Network error",
        message: "Please check your connection and try again.",
        retryable: true,
      };
  }

  // Firestore / generic network-ish errors often include these codes.
  switch (code) {
    case "permission-denied":
      return {
        title: "Access denied",
        message: "You don’t have permission to do that.",
      };
    case "unavailable":
    case "deadline-exceeded":
      return {
        title: "Service unavailable",
        message: "Please try again in a moment.",
        retryable: true,
      };
    case "not-found":
      return {
        title: "Not found",
        message: "We couldn’t find what you were looking for.",
      };
  }

  const msg = getErrorMessage(err);
  if (msg) {
    // Avoid dumping raw Firebase error prefixes when we can.
    const cleaned = msg
      .replace(/^Firebase:\s*/i, "")
      .replace(/\(auth\/[a-z-]+\)\.?$/i, "")
      .trim();
    return { title: fallbackTitle, message: cleaned || "Please try again." };
  }

  return { title: fallbackTitle, message: "Please try again." };
}
