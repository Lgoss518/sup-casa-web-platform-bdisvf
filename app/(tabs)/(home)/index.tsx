
import React, { useState } from "react";
import { Stack, Link, useRouter } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  Platform 
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { useDocuments } from "@/hooks/useDocuments";
import { SafeAreaView } from "react-native-safe-area-context";
import { Document } from "@/types/Document";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { documents, filter, updateFilter } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    updateFilter({ searchQuery: text });
  };

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

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/filters')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol
        name="line.3.horizontal.decrease.circle.fill"
        color={theme.colors.primary}
      />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <View style={{ width: 40 }} />
  );

  const renderDocument = (doc: Document) => (
    <Link key={doc.id} href={`/document/${doc.id}`} asChild>
      <Pressable>
        <GlassView 
          style={[
            styles.documentCard,
            Platform.OS !== 'ios' && { 
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }
          ]} 
          glassEffectStyle="regular"
        >
          <View style={[styles.documentIcon, { backgroundColor: getDocumentTypeColor(doc.type) }]}>
            <IconSymbol name={getDocumentTypeIcon(doc.type)} color="white" size={24} />
          </View>
          <View style={styles.documentContent}>
            <Text style={[styles.documentTitle, { color: theme.colors.text }]} numberOfLines={1}>
              {doc.title}
            </Text>
            <Text style={[styles.documentSubject, { color: theme.dark ? '#98989D' : '#666' }]}>
              {doc.subject} • {doc.level}
            </Text>
            <View style={styles.documentMeta}>
              <View style={[styles.badge, { backgroundColor: getDocumentTypeColor(doc.type) + '20' }]}>
                <Text style={[styles.badgeText, { color: getDocumentTypeColor(doc.type) }]}>
                  {doc.type === 'course' ? 'Cours' : doc.type === 'practical' ? 'TP' : 'Examen'}
                </Text>
              </View>
            </View>
          </View>
          <IconSymbol name="chevron.right" color={theme.dark ? '#98989D' : '#666'} size={20} />
        </GlassView>
      </Pressable>
    </Link>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "SUP CASA",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            Bienvenue sur SUP CASA
          </Text>
          <Text style={[styles.subtitleText, { color: theme.dark ? '#98989D' : '#666' }]}>
            Votre plateforme de ressources académiques
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <GlassView 
            style={[
              styles.searchBar,
              Platform.OS !== 'ios' && { 
                backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
              }
            ]} 
            glassEffectStyle="regular"
          >
            <IconSymbol name="magnifyingglass" color={theme.dark ? '#98989D' : '#666'} size={20} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Rechercher des documents..."
              placeholderTextColor={theme.dark ? '#98989D' : '#666'}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => handleSearch('')}>
                <IconSymbol name="xmark.circle.fill" color={theme.dark ? '#98989D' : '#666'} size={20} />
              </Pressable>
            )}
          </GlassView>
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable onPress={() => router.push('/filters')} style={{ flex: 1 }}>
            <GlassView 
              style={[
                styles.actionButton,
                Platform.OS !== 'ios' && { 
                  backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
                }
              ]} 
              glassEffectStyle="regular"
            >
              <IconSymbol name="line.3.horizontal.decrease.circle.fill" color={theme.colors.primary} size={24} />
              <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Filtres</Text>
            </GlassView>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {filter.level || filter.subject || filter.type ? 'Résultats filtrés' : 'Tous les documents'}
            </Text>
            <Text style={[styles.resultCount, { color: theme.dark ? '#98989D' : '#666' }]}>
              {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            </Text>
          </View>

          {documents.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="doc.text.magnifyingglass" color={theme.dark ? '#98989D' : '#666'} size={64} />
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#98989D' : '#666' }]}>
                Aucun document trouvé
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                Essayez d&apos;ajuster vos filtres ou votre recherche
              </Text>
            </View>
          ) : (
            documents.map(renderDocument)
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 14,
  },
  documentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  documentSubject: {
    fontSize: 14,
    marginBottom: 6,
  },
  documentMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerButtonContainer: {
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
