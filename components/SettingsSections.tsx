import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type SettingItem = 
  | {
      icon: string;
      label: string;
      value: boolean;
      onToggle: (value: boolean) => void;
    }
  | {
      icon: string;
      label: string;
      action: true;
      onPress?: () => void;
    };

interface Section {
  title: string;
  items: SettingItem[];
}

interface SettingsSectionsProps {
  sections: Section[];
}

export default function SettingsSections({ sections }: SettingsSectionsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#9ca3af" : "#6b7280" }]}>
            {section.title}
          </Text>
          <View
            style={[
              styles.sectionContent,
              {
                backgroundColor: isDark ? "#0b1220" : "#fff",
                borderColor: isDark ? "#111827" : "#f3f4f6",
              },
            ]}
          >
            {section.items.map((item, itemIndex) => {
              const isToggle = "value" in item;

              return (
                <View key={itemIndex}>
                  <Pressable
                    style={styles.settingItem}
                    onPress={() => {
                      if (!isToggle && "onPress" in item && item.onPress) {
                        item.onPress();
                      }
                    }}
                  >
                    <View style={styles.settingLeft}>
                      <View
                        style={[
                          styles.settingIconBg,
                          { backgroundColor: isDark ? "#111827" : "#ede9fe" },
                        ]}
                      >
                        <IconSymbol
                          name={item.icon as any}
                          size={18}
                          color="#4f46e5"
                        />
                      </View>
                      <Text
                        style={[
                          styles.settingLabel,
                          { color: isDark ? "#e5e7eb" : "#111827" },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    {isToggle && "value" in item ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{
                          false: isDark ? "#334155" : "#d1d5db",
                          true: "#c7d2fe",
                        }}
                        thumbColor={item.value ? "#4f46e5" : isDark ? "#94a3b8" : "#9ca3af"}
                      />
                    ) : (
                      <IconSymbol
                        name="chevron.right"
                        size={20}
                        color={isDark ? "#334155" : "#d1d5db"}
                      />
                    )}
                  </Pressable>
                  {itemIndex < section.items.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: isDark ? "#111827" : "#f3f4f6" },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 0,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
    marginHorizontal: 16,
    textTransform: "uppercase",
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  settingIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 16,
  },
});
