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
    ScrollView,
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
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [featured, setFeatured] = useState(false);

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
                featured,
            });
            onSuccess();
            onCancel();
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

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8, marginBottom: -10 }}>
                    <Pressable onPress={onCancel} style={{ padding: 8 }} accessibilityLabel="Close">
                        <Ionicons name="close" size={26} color="#6366f1" />
                    </Pressable>
                </View>
                <Text style={styles.title}>Create New Event</Text>
                <Text style={styles.sectionHeading}>Event Details</Text>
                <View style={styles.sectionCard}>
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
                    <View style={styles.rowWrap}>
                        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
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
                        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
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
                        <Text style={styles.label}>Image (optional)</Text>
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
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 4 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#6366f1', marginRight: 10 }}>Feature this event</Text>
                    <Pressable
                        onPress={() => setFeatured(f => !f)}
                        style={{
                            width: 44,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: featured ? '#6366f1' : '#e5e7eb',
                            justifyContent: 'center',
                            padding: 2,
                        }}
                        accessibilityRole="switch"
                        accessibilityState={{ checked: featured }}
                    >
                        <View style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            backgroundColor: '#fff',
                            marginLeft: featured ? 18 : 2,
                            shadowColor: '#6366f1',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.12,
                            shadowRadius: 2,
                        }} />
                    </Pressable>
                </View>

                <Text style={styles.sectionHeading}>Description</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.section}>
                        <TextInput
                            style={[
                                styles.input,
                                { height: 80, textAlignVertical: 'top' },
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
                </View>

                <Text style={styles.sectionHeading}>Organizer Info</Text>
                <View style={styles.sectionCard}>
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
                </View>

                <Text style={styles.sectionHeading}>Additional Info</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.rowWrap}>
                        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
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
                        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Tags</Text>
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
                    </View>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#fff',
        minHeight: '100%',
    },
    container: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 28,
        shadowColor: "#e0e7ef",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
        marginBottom: 32,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#222",
        marginBottom: 18,
        textAlign: "center",
        letterSpacing: 0.2,
    },
    sectionHeading: {
        fontSize: 17,
        fontWeight: '700',
        color: '#6366f1',
        marginTop: 18,
        marginBottom: 6,
        marginLeft: 2,
        letterSpacing: 0.1,
    },
    sectionCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 18,
        padding: 14,
        marginBottom: 8,
        marginHorizontal: 0,
        shadowColor: '#e0e7ef',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    section: {
        marginBottom: 14,
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
        borderRadius: 14,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        fontSize: 16,
        marginBottom: 0,
    },
    inputFocused: {
        borderColor: "#6366f1",
        backgroundColor: "#f0f3ff",
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
        backgroundColor: "#fff",
        borderRadius: 14,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    inputText: {
        color: "#222",
        fontSize: 16,
        marginLeft: 8,
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
    rowWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 0,
    },
});
