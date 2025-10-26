
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from 'expo-glass-effect';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@react-navigation/native';
import { useDocuments } from '@/hooks/useDocuments';
import { levels, subjects, documentTypes } from '@/data/mockDocuments';

export default function FiltersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { filter, updateFilter, clearFilters } = useDocuments();

  const handleLevelSelect = (level: string) => {
    updateFilter({ level: level === filter.level ? undefined : level as any });
  };

  const handleSubjectSelect = (subject: string) => {
    updateFilter({ subject: subject === filter.subject ? undefined : subject });
  };

  const handleTypeSelect = (type: string) => {
    updateFilter({ type: type === filter.type ? undefined : type as any });
  };

  const handleClearAll = () => {
    clearFilters();
  };

  const hasActiveFilters = filter.level || filter.subject || filter.type;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" color={theme.colors.primary} size={24} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Filters</Text>
        {hasActiveFilters && (
          <Pressable onPress={handleClearAll}>
            <Text style={[styles.clearButton, { color: theme.colors.primary }]}>Clear All</Text>
          </Pressable>
        )}
        {!hasActiveFilters && <View style={{ width: 60 }} />}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Academic Level</Text>
          <View style={styles.filterGrid}>
            {levels.map((level) => (
              <Pressable
                key={level}
                onPress={() => handleLevelSelect(level)}
              >
                <GlassView
                  style={[
                    styles.filterChip,
                    filter.level === level && styles.filterChipActive,
                    Platform.OS !== 'ios' && {
                      backgroundColor: filter.level === level
                        ? theme.colors.primary + '40'
                        : theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }
                  ]}
                  glassEffectStyle={filter.level === level ? 'prominent' : 'regular'}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: filter.level === level ? theme.colors.primary : theme.colors.text }
                    ]}
                  >
                    {level}
                  </Text>
                </GlassView>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Subject</Text>
          <View style={styles.filterList}>
            {subjects.map((subject) => (
              <Pressable
                key={subject}
                onPress={() => handleSubjectSelect(subject)}
              >
                <GlassView
                  style={[
                    styles.filterItem,
                    filter.subject === subject && styles.filterItemActive,
                    Platform.OS !== 'ios' && {
                      backgroundColor: filter.subject === subject
                        ? theme.colors.primary + '40'
                        : theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }
                  ]}
                  glassEffectStyle={filter.subject === subject ? 'prominent' : 'regular'}
                >
                  <Text
                    style={[
                      styles.filterItemText,
                      { color: filter.subject === subject ? theme.colors.primary : theme.colors.text }
                    ]}
                  >
                    {subject}
                  </Text>
                  {filter.subject === subject && (
                    <IconSymbol name="checkmark.circle.fill" color={theme.colors.primary} size={20} />
                  )}
                </GlassView>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Document Type</Text>
          <View style={styles.filterList}>
            {documentTypes.map((docType) => (
              <Pressable
                key={docType.value}
                onPress={() => handleTypeSelect(docType.value)}
              >
                <GlassView
                  style={[
                    styles.filterItem,
                    filter.type === docType.value && styles.filterItemActive,
                    Platform.OS !== 'ios' && {
                      backgroundColor: filter.type === docType.value
                        ? theme.colors.primary + '40'
                        : theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }
                  ]}
                  glassEffectStyle={filter.type === docType.value ? 'prominent' : 'regular'}
                >
                  <Text
                    style={[
                      styles.filterItemText,
                      { color: filter.type === docType.value ? theme.colors.primary : theme.colors.text }
                    ]}
                  >
                    {docType.label}
                  </Text>
                  {filter.type === docType.value && (
                    <IconSymbol name="checkmark.circle.fill" color={theme.colors.primary} size={20} />
                  )}
                </GlassView>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  clearButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterChipActive: {
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.5)',
  },
  filterChipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterList: {
    gap: 12,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  filterItemActive: {
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.5)',
  },
  filterItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
