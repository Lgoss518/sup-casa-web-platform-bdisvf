
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from 'expo-glass-effect';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@react-navigation/native';
import { mockDocuments } from '@/data/mockDocuments';

export default function DocumentDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const document = mockDocuments.find(doc => doc.id === id);

  if (!document) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" color={theme.dark ? '#98989D' : '#666'} size={64} />
          <Text style={[styles.errorText, { color: theme.colors.text }]}>Document not found</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: theme.colors.primary }]}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return 'book.fill';
      case 'practical':
        return 'hammer.fill';
      case 'exam':
        return 'doc.text.fill';
      default:
        return 'doc.fill';
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return '#007AFF';
      case 'practical':
        return '#34C759';
      case 'exam':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Download',
      `This would download: ${document.fileName}\n\nIn a production app, this would open the document or download it to your device.`,
      [{ text: 'OK' }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Share',
      `Share ${document.title} with others`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" color={theme.colors.primary} size={24} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          Document Details
        </Text>
        <Pressable onPress={handleShare} style={styles.shareButton}>
          <IconSymbol name="square.and.arrow.up" color={theme.colors.primary} size={22} />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GlassView
          style={[
            styles.iconContainer,
            Platform.OS !== 'ios' && {
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }
          ]}
          glassEffectStyle="regular"
        >
          <View style={[styles.documentIcon, { backgroundColor: getDocumentTypeColor(document.type) }]}>
            <IconSymbol name={getDocumentTypeIcon(document.type)} color="white" size={48} />
          </View>
        </GlassView>

        <Text style={[styles.title, { color: theme.colors.text }]}>{document.title}</Text>

        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: getDocumentTypeColor(document.type) + '20' }]}>
            <Text style={[styles.badgeText, { color: getDocumentTypeColor(document.type) }]}>
              {document.type === 'course' ? 'Course' : document.type === 'practical' ? 'Practical' : 'Exam'}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
              {document.level}
            </Text>
          </View>
        </View>

        <GlassView
          style={[
            styles.infoCard,
            Platform.OS !== 'ios' && {
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }
          ]}
          glassEffectStyle="regular"
        >
          <View style={styles.infoRow}>
            <IconSymbol name="book.closed.fill" color={theme.dark ? '#98989D' : '#666'} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Subject</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{document.subject}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <IconSymbol name="calendar" color={theme.dark ? '#98989D' : '#666'} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Upload Date</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {new Date(document.uploadDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <IconSymbol name="doc.fill" color={theme.dark ? '#98989D' : '#666'} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>File Name</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]} numberOfLines={1}>
                {document.fileName}
              </Text>
            </View>
          </View>
        </GlassView>

        {document.description && (
          <GlassView
            style={[
              styles.descriptionCard,
              Platform.OS !== 'ios' && {
                backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }
            ]}
            glassEffectStyle="regular"
          >
            <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>Description</Text>
            <Text style={[styles.descriptionText, { color: theme.dark ? '#98989D' : '#666' }]}>
              {document.description}
            </Text>
          </GlassView>
        )}

        <Pressable onPress={handleDownload}>
          <GlassView
            style={[
              styles.downloadButton,
              Platform.OS !== 'ios' && {
                backgroundColor: theme.colors.primary + '40'
              }
            ]}
            glassEffectStyle="prominent"
          >
            <IconSymbol name="arrow.down.circle.fill" color={theme.colors.primary} size={24} />
            <Text style={[styles.downloadButtonText, { color: theme.colors.primary }]}>
              View Document
            </Text>
          </GlassView>
        </Pressable>
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
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  documentIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: 16,
  },
  descriptionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  downloadButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
  },
  backLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
