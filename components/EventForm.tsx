import { db } from "@/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
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
    event?: any;
}

function parseEventDate(rawDate: any): Date | null {
    if (!rawDate) return null;

    if (typeof rawDate?.toDate === "function") {
        const parsed = rawDate.toDate();
        return parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed : null;
    }

    if (typeof rawDate === "object" && typeof rawDate.seconds === "number") {
        const parsed = new Date(rawDate.seconds * 1000);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    if (rawDate instanceof Date) {
        return Number.isNaN(rawDate.getTime()) ? null : rawDate;
    }

    if (typeof rawDate === "string") {
        const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = rawDate.match(isoDateOnly);
        if (match) {
            const [, y, m, d] = match;
            const parsed = new Date(Number(y), Number(m) - 1, Number(d));
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
    }

    const parsed = new Date(rawDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseEventTime(rawTime: any, baseDate: Date | null): Date | null {
    if (!rawTime) return null;

    if (typeof rawTime?.toDate === "function") {
        const parsed = rawTime.toDate();
        if (parsed instanceof Date && !Number.isNaN(parsed.getTime())) {
            return parsed;
        }
    }

    if (typeof rawTime === "object" && typeof rawTime.seconds === "number") {
        const parsed = new Date(rawTime.seconds * 1000);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    if (rawTime instanceof Date) {
        return Number.isNaN(rawTime.getTime()) ? null : rawTime;
    }

    const seed = baseDate ? new Date(baseDate) : new Date();
    seed.setSeconds(0, 0);

    if (typeof rawTime === "string") {
        const twelveHour = rawTime.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
        if (twelveHour) {
            let hours = Number(twelveHour[1]);
            const minutes = Number(twelveHour[2]);
            const period = twelveHour[3].toUpperCase();

            if (period === "PM" && hours < 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            seed.setHours(hours, minutes, 0, 0);
            return seed;
        }

        const twentyFourHour = rawTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        if (twentyFourHour) {
            const hours = Number(twentyFourHour[1]);
            const minutes = Number(twentyFourHour[2]);
            const seconds = twentyFourHour[3] ? Number(twentyFourHour[3]) : 0;

            seed.setHours(hours, minutes, seconds, 0);
            return seed;
        }
    }

    const parsed = new Date(rawTime);
    if (Number.isNaN(parsed.getTime())) return null;

    seed.setHours(parsed.getHours(), parsed.getMinutes(), parsed.getSeconds(), 0);
    return seed;
}


export default function EventForm({ onSuccess, onCancel, event }: EventFormProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { user } = useAuth();
    const parsedDateFromDate = parseEventDate(event?.date);
    const parsedDateFromTime = parseEventDate(event?.time);
    const parsedInitialDate = parsedDateFromDate || parsedDateFromTime;
    const parsedInitialTime = parseEventTime(event?.time, parsedInitialDate);

    const [title, setTitle] = useState(event?.title || "");
    const [date, setDate] = useState<Date | null>(parsedInitialDate);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState<Date | null>(parsedInitialTime);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [location, setLocation] = useState(event?.location || "");
    const [imageUrl, setImageUrl] = useState(event?.imageUrl || "");
    const [description, setDescription] = useState(event?.description || "");
    const [organizer, setOrganizer] = useState(event?.organizer || "");
    const [contact, setContact] = useState(event?.contact || "");
    const [price, setPrice] = useState(event?.price ? String(event.price) : "");
    const [tags, setTags] = useState(
        event?.tags
            ? Array.isArray(event.tags)
                ? event.tags.join(", ")
                : typeof event.tags === 'string'
                    ? event.tags
                    : ""
            : ""
    );
    const [website, setWebsite] = useState(event?.website || "");
    const [uploadImage, setUploadImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [featured, setFeatured] = useState(event?.featured || false);

    const isEdit = !!event;
    const initialValues = React.useRef({
        title: event?.title || "",
        date: parsedInitialDate,
        time: parsedInitialTime,
        location: event?.location || "",
        imageUrl: event?.imageUrl || "",
        description: event?.description || "",
        organizer: event?.organizer || "",
        contact: event?.contact || "",
        price: event?.price ? String(event.price) : "",
        tags: event?.tags
            ? Array.isArray(event.tags)
                ? event.tags.join(", ")
                : typeof event.tags === 'string'
                    ? event.tags
                    : ""
            : "",
        website: event?.website || "",
        featured: event?.featured || false,
        uploadImage: null,
    });

    function isFieldChanged() {
        const v = initialValues.current;
        return (
            title !== v.title ||
            (date && (!v.date || date.getTime() !== v.date.getTime())) ||
            (v.date && !date) ||
            (time && (!v.time || time.getTime() !== v.time.getTime())) ||
            (v.time && !time) ||
            location !== v.location ||
            (uploadImage !== null) ||
            imageUrl !== v.imageUrl ||
            description !== v.description ||
            organizer !== v.organizer ||
            contact !== v.contact ||
            price !== v.price ||
            tags !== v.tags ||
            website !== v.website ||
            featured !== v.featured
        );
    }

    function isFormValid() {
        return (
            !!title &&
            !!date &&
            !!time &&
            !!location &&
            !!description &&
            !!organizer &&
            !!contact &&
            !!price &&
            !!tags &&
            !!website
        );
    }

    const handleCreateOrUpdate = async () => {
        setError("");
        if (!title || !date || !time || !location || !description || !organizer || !contact || !price || !tags || !website) {
            setError("Please fill all fields");
            return;
        }
        setLoading(true);
        try {
            const eventData = {
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
                tags: tags.split(",").map((t: string) => t.trim().toUpperCase()),
                website,
                status: "upcoming",
                featured,
                createdBy: user?.uid || null,
                ...(event ? {} : { createdAt: serverTimestamp() }),
            };
            if (event && event.id) {
                await updateDoc(doc(db, "events", event.id), eventData);
            } else {
                await addDoc(collection(db, "events"), eventData);
            }
            onSuccess();
            onCancel();
        } catch (err: any) {
            setError(err.message || "Failed to save event");
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
        <ScrollView
            contentContainerStyle={[
                styles.scrollContainer,
                { backgroundColor: isDark ? "#0b1220" : "#fff" },
            ]}
            showsVerticalScrollIndicator={false}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: isDark ? "#0b1220" : "#fff", shadowOpacity: isDark ? 0.2 : 0.12 },
                ]}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8, marginBottom: -10 }}>
                    <Pressable onPress={onCancel} style={{ padding: 8 }} accessibilityLabel="Close">
                        <Ionicons name="close" size={26} color="#6366f1" />
                    </Pressable>
                </View>
                <Text style={[styles.title, { color: isDark ? "#e5e7eb" : "#222" }]}>
                    {event ? 'Edit Event' : 'Create New Event'}
                </Text>
                <Text style={styles.sectionHeading}>Event Details</Text>
                <View style={[styles.sectionCard, { backgroundColor: isDark ? "#0f172a" : "#f8fafc" }]}>
                    <View style={styles.section}>
                        <Text style={styles.label}>Event Title</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: isDark ? "#0b1220" : "#fff",
                                    borderColor: isDark ? "#1f2937" : "#e5e7eb",
                                    color: isDark ? "#e5e7eb" : "#111827",
                                },
                            ]}
                            placeholder="Enter event title"
                            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                    <View style={styles.rowWrap}>
                        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Date</Text>
                            <Pressable
                                style={[
                                    styles.inputBtn,
                                    {
                                        backgroundColor: isDark ? "#0b1220" : "#fff",
                                        borderColor: isDark ? "#1f2937" : "#e5e7eb",
                                    },
                                ]}
                                onPress={() => {
                                    setShowDatePicker(true);
                                    setShowTimePicker(false);
                                }}
                            >
                                <Text style={[styles.inputText, { color: isDark ? "#e5e7eb" : "#222" }]}>
                                    {date ? date.toLocaleDateString() : "Select Date"}
                                </Text>
                            </Pressable>
                        </View>
                        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Time</Text>
                            <Pressable
                                style={[
                                    styles.inputBtn,
                                    {
                                        backgroundColor: isDark ? "#0b1220" : "#fff",
                                        borderColor: isDark ? "#1f2937" : "#e5e7eb",
                                    },
                                ]}
                                onPress={() => {
                                    setShowTimePicker(true);
                                    setShowDatePicker(false);
                                }}
                            >
                                <Text style={[styles.inputText, { color: isDark ? "#e5e7eb" : "#222" }]}>
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
                                {
                                    backgroundColor: isDark ? "#0b1220" : "#fff",
                                    borderColor: isDark ? "#1f2937" : "#e5e7eb",
                                    color: isDark ? "#e5e7eb" : "#111827",
                                },
                            ]}
                            placeholder="Enter location"
                            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                            value={location}
                            onChangeText={setLocation}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Image</Text>
                        <Pressable
                            style={[
                                styles.inputBtn,
                                { marginTop: 8 },
                                { backgroundColor: isDark ? "#0b1220" : "#fff", borderColor: isDark ? "#1f2937" : "#e5e7eb" },
                            ]}
                            onPress={handlePickImage}
                        >
                            <Ionicons name="image-outline" size={18} color="#6366f1" />
                            <Text style={[styles.inputText, { color: isDark ? "#e5e7eb" : "#222" }]}>
                                {uploadImage ? "Image Selected" : "Upload Image"}
                            </Text>
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
                    <Text style={{ fontSize: 15, fontWeight: '600', color: isDark ? "#e5e7eb" : "#222", marginRight: 10 }}>Feature this event</Text>
                    <Pressable
                        onPress={() => setFeatured((f: boolean) => !f)}
                        style={{
                            width: 44,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: featured ? (isDark ? "#6366f1" : "#222") : (isDark ? "#e5e7eb" : "#f3f4f6"),
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
                            backgroundColor: isDark ? "#0b1220" : "#fff",
                            marginLeft: featured ? 18 : 2,
                            shadowColor: isDark ? "#6366f1" : "#222",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.12,
                            shadowRadius: 2,
                        }} />
                    </Pressable>
                </View>

                <Text style={styles.sectionHeading}>Description</Text>
                <View style={[styles.sectionCard, { backgroundColor: isDark ? "#0f172a" : "#f8fafc" }]}>
                    <View style={styles.section}>
                        <TextInput
                            style={[
                                styles.input,
                                { height: 80, textAlignVertical: 'top' },
                                {
                                    backgroundColor: isDark ? "#0b1220" : "#fff",
                                    borderColor: isDark ? "#1f2937" : "#e5e7eb",
                                    color: isDark ? "#e5e7eb" : "#111827",
                                },
                            ]}
                            placeholder="Enter event description"
                            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />
                    </View>
                </View>

                <Text style={styles.sectionHeading}>Organizer Info</Text>
                <View style={[styles.sectionCard, { backgroundColor: isDark ? "#0f172a" : "#f8fafc" }]}>
                    <View style={styles.section}>
                        <Text style={styles.label}>Organizer</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { color: isDark ? "#e5e7eb" : "#111827" },
                                { backgroundColor: isDark ? "#0b1220" : "#fff" },
                                { borderColor: isDark ? "#1f2937" : "#e5e7eb" },
                            ]}
                            placeholder="Enter organizer name"
                            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                            value={organizer}
                            onChangeText={setOrganizer}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Contact</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { color: isDark ? "#e5e7eb" : "#111827" },
                                { backgroundColor: isDark ? "#0b1220" : "#fff" },
                                { borderColor: isDark ? "#1f2937" : "#e5e7eb" },
                            ]}
                            placeholder="Enter contact info"
                            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                            value={contact}
                            onChangeText={setContact}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Website</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { color: isDark ? "#e5e7eb" : "#111827" },
                                { backgroundColor: isDark ? "#0b1220" : "#fff" },
                                { borderColor: isDark ? "#1f2937" : "#e5e7eb" },
                            ]}
                            placeholder="Enter website URL"
                            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                            value={website}
                            onChangeText={setWebsite}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <Text style={styles.sectionHeading}>Additional Info</Text>
                <View style={[styles.sectionCard, { backgroundColor: isDark ? "#0f172a" : "#f8fafc" }]}>
                    <View style={styles.rowWrap}>
                        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Price (PKR)</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: isDark ? "#e5e7eb" : "#111827" },
                                    { backgroundColor: isDark ? "#0b1220" : "#fff" },
                                    { borderColor: isDark ? "#1f2937" : "#e5e7eb" },
                                ]}
                                placeholder="Enter price in PKR"
                                placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Tags</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: isDark ? "#e5e7eb" : "#111827" },
                                    { backgroundColor: isDark ? "#0b1220" : "#fff" },
                                    { borderColor: isDark ? "#1f2937" : "#e5e7eb" },
                                ]}
                                placeholder="e.g. MUSIC, ART, TECH"
                                placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                                value={tags}
                                onChangeText={setTags}
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
                            pressed && styles.buttonPressed,
                            (isEdit && (!isFormValid() || !isFieldChanged())) && { opacity: 0.5 }
                        ]}
                        onPress={handleCreateOrUpdate}
                        disabled={loading || (isEdit && (!isFormValid() || !isFieldChanged()))}
                    >
                        {loading ? (
                            <ActivityIndicator color="#f2f2f2" />
                        ) : (
                            <Text style={styles.buttonText}>{event ? 'Update' : 'Create'}</Text>
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
        minHeight: '100%',
    },
    container: {
        width: "100%",
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
    inputText: { color: "#222", fontSize: 16, marginLeft: 8 },
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
