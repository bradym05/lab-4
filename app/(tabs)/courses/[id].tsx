import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { theme } from "@/styles/theme";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "@/components/app-card";
import * as api from "@/lib/api";

const CourseDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<api.CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  async function laodCourse() {
    try {
      setError(null);
      setIsLoading(true);
      const result = await api.getCourseById(id!);
      setCourse(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    laodCourse();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    <View style={styles.centered}>
      <Ionicons
        name="cloud-offline-outline"
        size={48}
        color={theme.colors.muted}
      />
      <Text style={styles.errorText}>{error}</Text>
      <Pressable style={styles.retryButton} onPress={laodCourse}>
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    </View>;
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.code}>{course?.code}</Text>
      <Text style={styles.h1}>{course?.title} </Text>
      <Text style={styles.desription}>{course?.description}</Text>
      {/* Info Card */}
      <Text style={styles.sectionTitle}>Course Info</Text>
      <AppCard 
      title="Instructor"
      subtitle={course?.instructor}
      right={
        <Ionicons name="person-outline" size={20} color={theme.colors.muted} />
      }
      />
    </ScrollView>
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
  },
  h1: { fontSize: 22, fontWeight: "800", color: theme.colors.text },
  p: {
    marginTop: 10,
    color: theme.colors.muted,
  },
  code: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.screen,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.primary,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.muted,
    fontSize: 15,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center",
  },
  desription: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text,
    marginBottom: 8,
  },
  content:{
    padding: theme.spacing.screen,
    paddingBottom: 40
  },
  sectionTitle:{
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 10
  }
});
