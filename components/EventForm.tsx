import { db } from "@/firebase";
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface EventFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EventForm({ onSuccess, onCancel }: EventFormProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
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
                date,
                time,
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
            <View style={styles.rowWrap}>
                <View style={[styles.section, { flex: 1, marginRight: 6 }]}>
                    <Text style={styles.label}>Date</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={date}
                        onChangeText={setDate}
                    />
                </View>
                <View style={[styles.section, { flex: 1, marginLeft: 6 }]}>
                    <Text style={styles.label}>Time</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="HH:MM"
                        value={time}
                        onChangeText={setTime}
                    />
                </View>
            </View>
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
                    <View style={{ alignItems: 'center', marginTop: 8 }}>
                        <View style={styles.imagePreviewWrap}>
                            <Image
                                source={{ uri: imageUrl }}
                                style={{ width: 64, height: 64, borderRadius: 12, resizeMode: 'cover', borderWidth: 1, borderColor: '#e5e7eb' }}
                                onError={() => setImageUrl("")}
                            />
                        </View>
                    </View>
                ) : null}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
                <View style={styles.buttonRow}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.createButton,
                            loading && { opacity: 0.6 },
                            pressed && { backgroundColor: '#4f46e5' }
                        ]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="add-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.buttonText}>Create</Text>
                            </View>
                        )}
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.cancelButton,
                            pressed && { backgroundColor: '#e5e7eb' }
                        ]}
                        onPress={onCancel}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="close-circle" size={20} color="#6366f1" style={{ marginRight: 6 }} />
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </View>
                    </Pressable>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 18,
        alignItems: 'stretch',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 16,
        elevation: 6,
    },
    section: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#6366f1',
        fontWeight: '600',
        marginBottom: 4,
        marginLeft: 2,
    },
    rowWrap: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    imagePreviewWrap: {
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginTop: 2,
        marginBottom: 2,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 18,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 44,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f8fafc',
        fontSize: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 18,
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
    },
    createButton: {
        backgroundColor: '#6366f1',
        marginRight: 4,
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        marginLeft: 4,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#6366f1',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: '#dc2626',
        marginBottom: 8,
        textAlign: 'center',
    },
    linkBtn: {
        marginTop: 12,
        alignItems: 'center',
    },
    link: {
        color: '#6366f1',
        fontSize: 15,
        fontWeight: '500',
    },
});
