
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <GlassView style={[
          styles.profileHeader,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <IconSymbol name="person.circle.fill" size={80} color={theme.colors.primary} />
          <Text style={[styles.name, { color: theme.colors.text }]}>Étudiant</Text>
          <Text style={[styles.email, { color: theme.dark ? '#98989D' : '#666' }]}>etudiant@supcasa.ma</Text>
        </GlassView>

        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>À propos de SUP CASA</Text>
          <Text style={[styles.aboutText, { color: theme.dark ? '#98989D' : '#666' }]}>
            SUP CASA est votre plateforme centralisée pour les ressources académiques de la communauté de l&apos;enseignement supérieur de Casablanca.
          </Text>
          <Text style={[styles.aboutText, { color: theme.dark ? '#98989D' : '#666' }]}>
            Accédez aux cours, tutoriels, sujets d&apos;examens et exercices corrigés en un seul endroit.
          </Text>
        </GlassView>

        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Statistiques rapides</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol name="doc.fill" size={24} color={theme.colors.primary} />
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>8</Text>
              <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Documents</Text>
            </View>
            
            <View style={styles.statItem}>
              <IconSymbol name="book.fill" size={24} color="#34C759" />
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>5</Text>
              <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Modules</Text>
            </View>
            
            <View style={styles.statItem}>
              <IconSymbol name="graduationcap.fill" size={24} color="#FF9500" />
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>9</Text>
              <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Niveaux</Text>
            </View>
          </View>
        </GlassView>

        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Mission</Text>
          <View style={styles.missionItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#34C759" />
            <Text style={[styles.missionText, { color: theme.dark ? '#98989D' : '#666' }]}>
              Éliminer les supports d&apos;étude dispersés
            </Text>
          </View>
          <View style={styles.missionItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#34C759" />
            <Text style={[styles.missionText, { color: theme.dark ? '#98989D' : '#666' }]}>
              Centraliser les ressources académiques
            </Text>
          </View>
          <View style={styles.missionItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#34C759" />
            <Text style={[styles.missionText, { color: theme.dark ? '#98989D' : '#666' }]}>
              Favoriser la collaboration et le partage
            </Text>
          </View>
          <View style={styles.missionItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#34C759" />
            <Text style={[styles.missionText, { color: theme.dark ? '#98989D' : '#666' }]}>
              Promouvoir la culture numérique
            </Text>
          </View>
        </GlassView>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.dark ? '#98989D' : '#666' }]}>
            SUP CASA v1.0
          </Text>
          <Text style={[styles.footerText, { color: theme.dark ? '#98989D' : '#666' }]}>
            Permettre aux étudiants d&apos;étudier plus intelligemment, ensemble
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    gap: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  missionText: {
    fontSize: 15,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
