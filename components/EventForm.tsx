import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface EventFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EventForm({ onSuccess, onCancel }: EventFormProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState<Date | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [location, setLocation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        setError("");
        if (!title || !date || !time || !location) {
            setError("Please fill all fields");
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, "events"), {
                title,
                date: date?.toISOString().split("T")[0],
                time: time
                    ? time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "",
                location,
                imageUrl,
                status: "upcoming",
            });
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to create event");
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Event</Text>
            <View style={styles.section}>
                <Text style={styles.label}>Event Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter event title"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Date</Text>

                <Pressable
                    style={styles.inputBtn}
                    onPress={() => {
                        setShowDatePicker(true);
                        setShowTimePicker(false);
                    }}
                >
                    <Ionicons name="calendar-outline" size={18} color="#6366f1" />
                    <Text style={styles.inputText}>
                        {date ? date.toLocaleDateString() : "Select Date"}
                    </Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Time</Text>
                <Pressable
                    style={styles.inputBtn}
                    onPress={() => {
                        setShowTimePicker(true);
                        setShowDatePicker(false);
                    }}
                >
                    <Ionicons name="time-outline" size={18} color="#6366f1" />
                    <Text style={styles.inputText}>
                        {time
                            ? time.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "Select Time"}
                    </Text>
                </Pressable>
            </View>
            {showDatePicker && (
                <View style={styles.pickerWrap}>
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                            if (Platform.OS === "android") setShowDatePicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                    {Platform.OS === "ios" && (
                        <Pressable
                            onPress={() => setShowDatePicker(false)}
                            style={styles.doneBtn}
                        >
                            <Text style={styles.doneText}>Done</Text>
                        </Pressable>
                    )}
                </View>
            )}
            {showTimePicker && (
                <View style={styles.pickerWrap}>
                    <DateTimePicker
                        value={time || new Date()}
                        mode="time"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedTime) => {
                            if (Platform.OS === "android") setShowTimePicker(false);
                            if (selectedTime) setTime(selectedTime);
                        }}
                    />

                    {Platform.OS === "ios" && (
                        <Pressable
                            onPress={() => setShowTimePicker(false)}
                            style={styles.doneBtn}
                        >
                            <Text style={styles.doneText}>Done</Text>
                        </Pressable>
                    )}
                </View>
            )}
            <View style={styles.section}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter location"
                    value={location}
                    onChangeText={setLocation}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Image URL (optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Paste image URL"
                    value={imageUrl}
                    onChangeText={setImageUrl}
                />
                {imageUrl ? (
                    <View style={{ alignItems: "center", marginTop: 8 }}>
                        <View style={styles.imagePreviewWrap}>
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.imagePreview}
                                onError={() => setImageUrl("")}
                            />
                        </View>
                    </View>
                ) : null}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.buttonRow}>
                <Pressable
                    style={[styles.button, styles.createButton]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Ionicons
                                name="add-circle"
                                size={20}
                                color="#fff"
                                style={{ marginRight: 6 }}
                            />
                            <Text style={styles.buttonText}>Create</Text>
                        </View>
                    )}
                </Pressable>

                <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                >
                    <View style={styles.buttonContent}>
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color="#6366f1"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 24,
        backgroundColor: "#fff",
        borderRadius: 18,
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 18,
        textAlign: "center",
    },
    section: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: "#6366f1",
        fontWeight: "600",
        marginBottom: 4,
    },
    input: {
        width: "100%",
        height: 44,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: "#f8fafc",
        fontSize: 15,
    },
    inputBtn: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#f8fafc",
        borderRadius: 10,
        height: 44,
        paddingHorizontal: 12,
    },
    inputText: {
        marginLeft: 8,
        color: "#111827",
        fontSize: 15,
    },
    pickerWrap: {
        marginTop: 6,
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        overflow: "hidden",
    },
    doneBtn: {
        padding: 8,
        alignItems: "flex-end",
    },
    doneText: {
        color: "#6366f1",
        fontWeight: "600",
    },
    imagePreviewWrap: {
        backgroundColor: "#f3f4f6",
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    imagePreview: {
        width: 64,
        height: 64,
        borderRadius: 12,
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 18,
        gap: 12,
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
    },
    createButton: {
        backgroundColor: "#6366f1",
    },
    cancelButton: {
        backgroundColor: "#f3f4f6",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelButtonText: {
        color: "#6366f1",
        fontSize: 16,
        fontWeight: "600",
    },
    error: {
        color: "#dc2626",
        marginBottom: 8,
        textAlign: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
});
