import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
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
    const [description, setDescription] = useState("");
    const [organizer, setOrganizer] = useState("");
    const [contact, setContact] = useState("");
    const [price, setPrice] = useState("");
    const [tags, setTags] = useState("");
    const [website, setWebsite] = useState("");
    const [uploadImage, setUploadImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        setError("");
        if (!title || !date || !time || !location || !description || !organizer || !contact || !price || !tags || !website) {
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
                imageUrl: uploadImage || imageUrl,
                description,
                organizer,
                contact,
                price: Number(price),
                tags: tags.split(",").map((t) => t.trim().toUpperCase()),
                website,
                status: "upcoming",
            });
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to create event");
        }
        setLoading(false);
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setUploadImage(result.assets[0].uri);
        }
    };

    // For subtle input focus animation
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Event</Text>
            <View style={styles.section}>
                <Text style={styles.label}>Event Title</Text>
                <TextInput
                    style={[
                        styles.input,
                        focusedInput === 'title' && styles.inputFocused
                    ]}
                    placeholder="Enter event title"
                    value={title}
                    onChangeText={setTitle}
                    onFocus={() => setFocusedInput('title')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Date</Text>
                <Pressable
                    style={[
                        styles.inputBtn,
                        focusedInput === 'date' && styles.inputFocused
                    ]}
                    onPress={() => {
                        setShowDatePicker(true);
                        setShowTimePicker(false);
                        setFocusedInput('date');
                    }}
                    onBlur={() => setFocusedInput(null)}
                >
                    <Text style={styles.inputText}>
                        {date ? date.toLocaleDateString() : "Select Date"}
                    </Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Time</Text>
                <Pressable
                    style={[
                        styles.inputBtn,
                        focusedInput === 'time' && styles.inputFocused
                    ]}
                    onPress={() => {
                        setShowTimePicker(true);
                        setShowDatePicker(false);
                        setFocusedInput('time');
                    }}
                    onBlur={() => setFocusedInput(null)}
                >
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
                    style={[
                        styles.input,
                        focusedInput === 'location' && styles.inputFocused
                    ]}
                    placeholder="Enter location"
                    value={location}
                    onChangeText={setLocation}
                    onFocus={() => setFocusedInput('location')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Image URL (optional)</Text>
                <TextInput
                    style={[
                        styles.input,
                        focusedInput === 'imageUrl' && styles.inputFocused
                    ]}
                    placeholder="Paste image URL"
                    value={imageUrl}
                    onChangeText={setImageUrl}
                    onFocus={() => setFocusedInput('imageUrl')}
                    onBlur={() => setFocusedInput(null)}
                />
                <Pressable style={[styles.inputBtn, { marginTop: 8 }]} onPress={handlePickImage}>
                    <Ionicons name="image-outline" size={18} color="#6366f1" />
                    <Text style={styles.inputText}>{uploadImage ? "Image Selected" : "Upload Image"}</Text>
                </Pressable>
                {(uploadImage || imageUrl) ? (
                    <View style={{ alignItems: "center", marginTop: 8 }}>
                        <View style={styles.imagePreviewWrap}>
                            <Image
                                source={{ uri: uploadImage || imageUrl }}
                                style={styles.imagePreview}
                                onError={() => { setUploadImage(null); setImageUrl(""); }}
                            />
                        </View>
                    </View>
                ) : null}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[
                        styles.input,
                        { height: 64 },
                        focusedInput === 'description' && styles.inputFocused
                    ]}
                    placeholder="Enter event description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    onFocus={() => setFocusedInput('description')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Organizer</Text>
                <TextInput
                    style={[
                        styles.input,
                        focusedInput === 'organizer' && styles.inputFocused
                    ]}
                    placeholder="Enter organizer name"
                    value={organizer}
                    onChangeText={setOrganizer}
                    onFocus={() => setFocusedInput('organizer')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Contact</Text>
                <TextInput
                    style={[
                        styles.input,
                        focusedInput === 'contact' && styles.inputFocused
                    ]}
                    placeholder="Enter contact info"
                    value={contact}
                    onChangeText={setContact}
                    onFocus={() => setFocusedInput('contact')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Price (PKR)</Text>
                <TextInput
                    style={[
                        styles.input,
                        focusedInput === 'price' && styles.inputFocused
                    ]}
                    placeholder="Enter price in PKR"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    onFocus={() => setFocusedInput('price')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Tags (comma separated, will be uppercase)</Text>
                <TextInput
                    style={[
                        styles.input,
                        focusedInput === 'tags' && styles.inputFocused
                    ]}
                    placeholder="e.g. MUSIC, ART, TECH"
                    value={tags}
                    onChangeText={setTags}
                    onFocus={() => setFocusedInput('tags')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Website</Text>
                <TextInput
                    style={[
                        styles.input,
                        focusedInput === 'website' && styles.inputFocused
                    ]}
                    placeholder="Enter website URL"
                    value={website}
                    onChangeText={setWebsite}
                    autoCapitalize="none"
                    onFocus={() => setFocusedInput('website')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.buttonRow}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        styles.createButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#6366f1" />
                    ) : (
                        <Text style={styles.buttonText}>Create</Text>
                    )}
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        styles.cancelButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={onCancel}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 28,
        backgroundColor: "#fff",
        borderRadius: 28,
        shadowColor: "#e0e7ef",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#222",
        marginBottom: 24,
        textAlign: "center",
        letterSpacing: 0.2,
    },
    section: {
        marginBottom: 18,
    },
    label: {
        fontSize: 15,
        color: "#6366f1",
        fontWeight: "700",
        marginBottom: 6,
        letterSpacing: 0.1,
    },
    input: {
        width: "100%",
        height: 48,
        borderColor: "#e5e7eb",
        borderWidth: 1.5,
        borderRadius: 16,
        paddingHorizontal: 16,
        backgroundColor: "#f8fafc",
        fontSize: 16,
        transitionDuration: '200ms',
    },
    inputFocused: {
        borderColor: "#6366f1",
        backgroundColor: "#fff",
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    inputBtn: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#e5e7eb",
        backgroundColor: "#f8fafc",
        borderRadius: 16,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 16,
        transitionDuration: '200ms',
    },
    inputText: {
        color: "#222",
        fontSize: 16,
    },
    pickerWrap: {
        marginTop: 6,
        backgroundColor: "#f8fafc",
        borderRadius: 18,
        overflow: "hidden",
    },
    doneBtn: {
        padding: 10,
        alignItems: "flex-end",
    },
    doneText: {
        color: "#6366f1",
        fontWeight: "700",
        fontSize: 15,
    },
    imagePreviewWrap: {
        backgroundColor: "#f3f4f6",
        borderRadius: 18,
        padding: 6,
        borderWidth: 1.5,
        borderColor: "#e5e7eb",
    },
    imagePreview: {
        width: 72,
        height: 72,
        borderRadius: 18,
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 24,
        gap: 16,
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 18,
        transitionDuration: '200ms',
    },
    createButton: {
        backgroundColor: "#6366f1",
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
    },
    cancelButton: {
        backgroundColor: "#f3f4f6",
        borderWidth: 1.5,
        borderColor: "#e5e7eb",
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.97 }],
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.1,
    },
    cancelButtonText: {
        color: "#6366f1",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.1,
    },
    error: {
        color: "#dc2626",
        marginBottom: 10,
        textAlign: "center",
        fontWeight: '600',
        fontSize: 15,
    },
    // buttonContent removed for minimal style
});
