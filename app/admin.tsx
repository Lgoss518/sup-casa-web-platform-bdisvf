
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from 'expo-glass-effect';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@react-navigation/native';
import { levels, subjects, documentTypes } from '@/data/mockDocuments';
import { AcademicLevel, DocumentType } from '@/types/Document';

const ADMIN_PASSWORD = 'supcasa2024';

export default function AdminScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    level: '' as AcademicLevel | '',
    type: '' as DocumentType | '',
    description: '',
  });

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      Alert.alert('Error', 'Incorrect password. Please try again.');
    }
  };

  const handleUpload = () => {
    if (!formData.title || !formData.subject || !formData.level || !formData.type) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      'Document uploaded successfully!\n\nIn a production app, this would upload the file to your backend or cloud storage.',
      [
        {
          text: 'Upload Another',
          onPress: () => {
            setFormData({
              title: '',
              subject: '',
              level: '' as AcademicLevel | '',
              type: '' as DocumentType | '',
              description: '',
            });
          },
        },
        {
          text: 'Done',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handlePickDocument = () => {
    Alert.alert(
      'Pick Document',
      'In a production app, this would open the document picker to select a file from your device.\n\nYou would need to install expo-document-picker for this functionality.',
      [{ text: 'OK' }]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" color={theme.colors.primary} size={24} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Admin Login</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.loginContainer}>
          <GlassView
            style={[
              styles.loginCard,
              Platform.OS !== 'ios' && {
                backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              },
            ]}
            glassEffectStyle="regular"
          >
            <View style={styles.lockIconContainer}>
              <View style={[styles.lockIcon, { backgroundColor: theme.colors.primary }]}>
                <IconSymbol name="lock.fill" color="white" size={32} />
              </View>
            </View>

            <Text style={[styles.loginTitle, { color: theme.colors.text }]}>Admin Access</Text>
            <Text style={[styles.loginSubtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
              Enter password to continue
            </Text>

            <View style={styles.passwordContainer}>
              <GlassView
                style={[
                  styles.passwordInput,
                  Platform.OS !== 'ios' && {
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  },
                ]}
                glassEffectStyle="clear"
              >
                <IconSymbol name="key.fill" color={theme.dark ? '#98989D' : '#666'} size={20} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Password"
                  placeholderTextColor={theme.dark ? '#98989D' : '#666'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onSubmitEditing={handleLogin}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <IconSymbol
                    name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                    color={theme.dark ? '#98989D' : '#666'}
                    size={20}
                  />
                </Pressable>
              </GlassView>
            </View>

            <Pressable onPress={handleLogin}>
              <GlassView
                style={[
                  styles.loginButton,
                  Platform.OS !== 'ios' && {
                    backgroundColor: theme.colors.primary + '40',
                  },
                ]}
                glassEffectStyle="prominent"
              >
                <Text style={[styles.loginButtonText, { color: theme.colors.primary }]}>Login</Text>
              </GlassView>
            </Pressable>

            <Text style={[styles.hint, { color: theme.dark ? '#98989D' : '#666' }]}>
              Demo password: supcasa2024
            </Text>
          </GlassView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" color={theme.colors.primary} size={24} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Upload Document</Text>
        <Pressable onPress={() => setIsAuthenticated(false)} style={styles.logoutButton}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" color="#FF3B30" size={22} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GlassView
          style={[
            styles.uploadCard,
            Platform.OS !== 'ios' && {
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            },
          ]}
          glassEffectStyle="regular"
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Document Information</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title *</Text>
            <GlassView
              style={[
                styles.inputContainer,
                Platform.OS !== 'ios' && {
                  backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                },
              ]}
              glassEffectStyle="clear"
            >
              <TextInput
                style={[styles.textInput, { color: theme.colors.text }]}
                placeholder="Enter document title"
                placeholderTextColor={theme.dark ? '#98989D' : '#666'}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
            </GlassView>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Subject *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              <View style={styles.chipContainer}>
                {subjects.map((subject) => (
                  <Pressable key={subject} onPress={() => setFormData({ ...formData, subject })}>
                    <GlassView
                      style={[
                        styles.chip,
                        formData.subject === subject && styles.chipActive,
                        Platform.OS !== 'ios' && {
                          backgroundColor:
                            formData.subject === subject
                              ? theme.colors.primary + '40'
                              : theme.dark
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.03)',
                        },
                      ]}
                      glassEffectStyle={formData.subject === subject ? 'prominent' : 'clear'}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color:
                              formData.subject === subject ? theme.colors.primary : theme.colors.text,
                          },
                        ]}
                      >
                        {subject}
                      </Text>
                    </GlassView>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Academic Level *</Text>
            <View style={styles.levelGrid}>
              {levels.map((level) => (
                <Pressable key={level} onPress={() => setFormData({ ...formData, level })}>
                  <GlassView
                    style={[
                      styles.levelChip,
                      formData.level === level && styles.chipActive,
                      Platform.OS !== 'ios' && {
                        backgroundColor:
                          formData.level === level
                            ? theme.colors.primary + '40'
                            : theme.dark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.03)',
                      },
                    ]}
                    glassEffectStyle={formData.level === level ? 'prominent' : 'clear'}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: formData.level === level ? theme.colors.primary : theme.colors.text,
                        },
                      ]}
                    >
                      {level}
                    </Text>
                  </GlassView>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Document Type *</Text>
            <View style={styles.typeContainer}>
              {documentTypes.map((docType) => (
                <Pressable
                  key={docType.value}
                  onPress={() => setFormData({ ...formData, type: docType.value })}
                  style={{ flex: 1 }}
                >
                  <GlassView
                    style={[
                      styles.typeCard,
                      formData.type === docType.value && styles.chipActive,
                      Platform.OS !== 'ios' && {
                        backgroundColor:
                          formData.type === docType.value
                            ? theme.colors.primary + '40'
                            : theme.dark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.03)',
                      },
                    ]}
                    glassEffectStyle={formData.type === docType.value ? 'prominent' : 'clear'}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        {
                          color:
                            formData.type === docType.value ? theme.colors.primary : theme.colors.text,
                        },
                      ]}
                    >
                      {docType.label}
                    </Text>
                  </GlassView>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
            <GlassView
              style={[
                styles.inputContainer,
                styles.textAreaContainer,
                Platform.OS !== 'ios' && {
                  backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                },
              ]}
              glassEffectStyle="clear"
            >
              <TextInput
                style={[styles.textInput, styles.textArea, { color: theme.colors.text }]}
                placeholder="Enter document description (optional)"
                placeholderTextColor={theme.dark ? '#98989D' : '#666'}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </GlassView>
          </View>

          <Pressable onPress={handlePickDocument}>
            <GlassView
              style={[
                styles.filePickerButton,
                Platform.OS !== 'ios' && {
                  backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="doc.badge.plus" color={theme.colors.primary} size={24} />
              <Text style={[styles.filePickerText, { color: theme.colors.text }]}>Select File</Text>
              <Text style={[styles.filePickerSubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                PDF, Word, Images supported
              </Text>
            </GlassView>
          </Pressable>

          <Pressable onPress={handleUpload}>
            <GlassView
              style={[
                styles.uploadButton,
                Platform.OS !== 'ios' && {
                  backgroundColor: theme.colors.primary + '40',
                },
              ]}
              glassEffectStyle="prominent"
            >
              <IconSymbol name="arrow.up.circle.fill" color={theme.colors.primary} size={24} />
              <Text style={[styles.uploadButtonText, { color: theme.colors.primary }]}>Upload Document</Text>
            </GlassView>
          </Pressable>
        </GlassView>
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
  logoutButton: {
    padding: 4,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  lockIconContainer: {
    marginBottom: 24,
  },
  lockIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  passwordContainer: {
    width: '100%',
    marginBottom: 24,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  loginButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  uploadCard: {
    borderRadius: 20,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textInput: {
    fontSize: 16,
    padding: 0,
  },
  textAreaContainer: {
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 100,
  },
  chipScroll: {
    marginHorizontal: -4,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipActive: {
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.5)',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  levelChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  filePickerButton: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  filePickerText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  filePickerSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 12,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
