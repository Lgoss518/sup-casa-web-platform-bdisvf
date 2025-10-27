
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
import { AcademicLevel, DocumentType, Document } from '@/types/Document';
import { useDocuments } from '@/hooks/useDocuments';
import * as DocumentPicker from 'expo-document-picker';

const ADMIN_PASSWORD = 'supcasa2024';

type AdminView = 'upload' | 'manage';

export default function AdminScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { allDocuments, addDocument, updateDocument, deleteDocument } = useDocuments();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState<AdminView>('upload');
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

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

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        console.log('Selected file:', result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      level: '' as AcademicLevel | '',
      type: '' as DocumentType | '',
      description: '',
    });
    setSelectedFile(null);
    setEditingDocument(null);
  };

  const handleUpload = () => {
    if (!formData.title || !formData.subject || !formData.level || !formData.type) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!selectedFile && !editingDocument) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    if (editingDocument) {
      // Update existing document
      updateDocument(editingDocument.id, {
        title: formData.title,
        subject: formData.subject,
        level: formData.level as AcademicLevel,
        type: formData.type as DocumentType,
        description: formData.description,
        ...(selectedFile && {
          fileUri: selectedFile.uri,
          fileName: selectedFile.name,
          fileType: selectedFile.mimeType || 'application/octet-stream',
        }),
      });

      Alert.alert(
        'Success',
        'Document updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              setCurrentView('manage');
            },
          },
        ]
      );
    } else {
      // Add new document
      const newDocument: Document = {
        id: Date.now().toString(),
        title: formData.title,
        subject: formData.subject,
        level: formData.level as AcademicLevel,
        type: formData.type as DocumentType,
        fileUri: selectedFile!.uri,
        fileName: selectedFile!.name,
        fileType: selectedFile!.mimeType || 'application/octet-stream',
        uploadDate: new Date().toISOString().split('T')[0],
        description: formData.description,
      };

      addDocument(newDocument);

      Alert.alert(
        'Success',
        'Document uploaded successfully!',
        [
          {
            text: 'Upload Another',
            onPress: resetForm,
          },
          {
            text: 'View Documents',
            onPress: () => {
              resetForm();
              setCurrentView('manage');
            },
          },
        ]
      );
    }
  };

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
    setFormData({
      title: doc.title,
      subject: doc.subject,
      level: doc.level,
      type: doc.type,
      description: doc.description || '',
    });
    setCurrentView('upload');
  };

  const handleDelete = (doc: Document) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${doc.title}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDocument(doc.id);
            Alert.alert('Success', 'Document deleted successfully');
          },
        },
      ]
    );
  };

  const getDocumentTypeIcon = (type: DocumentType) => {
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

  const getDocumentTypeColor = (type: DocumentType) => {
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {currentView === 'upload' ? (editingDocument ? 'Edit Document' : 'Upload Document') : 'Manage Documents'}
        </Text>
        <Pressable onPress={() => setIsAuthenticated(false)} style={styles.logoutButton}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" color="#FF3B30" size={22} />
        </Pressable>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => {
            setCurrentView('upload');
            if (editingDocument) {
              resetForm();
            }
          }}
          style={{ flex: 1 }}
        >
          <GlassView
            style={[
              styles.tab,
              currentView === 'upload' && styles.tabActive,
              Platform.OS !== 'ios' && {
                backgroundColor:
                  currentView === 'upload'
                    ? theme.colors.primary + '40'
                    : theme.dark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
              },
            ]}
            glassEffectStyle={currentView === 'upload' ? 'prominent' : 'clear'}
          >
            <IconSymbol
              name="arrow.up.doc.fill"
              color={currentView === 'upload' ? theme.colors.primary : theme.colors.text}
              size={20}
            />
            <Text
              style={[
                styles.tabText,
                { color: currentView === 'upload' ? theme.colors.primary : theme.colors.text },
              ]}
            >
              Upload
            </Text>
          </GlassView>
        </Pressable>

        <Pressable onPress={() => setCurrentView('manage')} style={{ flex: 1 }}>
          <GlassView
            style={[
              styles.tab,
              currentView === 'manage' && styles.tabActive,
              Platform.OS !== 'ios' && {
                backgroundColor:
                  currentView === 'manage'
                    ? theme.colors.primary + '40'
                    : theme.dark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
              },
            ]}
            glassEffectStyle={currentView === 'manage' ? 'prominent' : 'clear'}
          >
            <IconSymbol
              name="folder.fill"
              color={currentView === 'manage' ? theme.colors.primary : theme.colors.text}
              size={20}
            />
            <Text
              style={[
                styles.tabText,
                { color: currentView === 'manage' ? theme.colors.primary : theme.colors.text },
              ]}
            >
              Manage ({allDocuments.length})
            </Text>
          </GlassView>
        </Pressable>
      </View>

      {currentView === 'upload' ? (
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
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {editingDocument ? 'Edit Document Information' : 'Document Information'}
            </Text>

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
                <Text style={[styles.filePickerText, { color: theme.colors.text }]}>
                  {selectedFile ? selectedFile.name : editingDocument ? 'Change File (Optional)' : 'Select File *'}
                </Text>
                <Text style={[styles.filePickerSubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                  {selectedFile ? `${(selectedFile.size! / 1024).toFixed(2)} KB` : 'PDF, Word, Images supported'}
                </Text>
              </GlassView>
            </Pressable>

            {editingDocument && (
              <Pressable onPress={resetForm} style={{ marginBottom: 12 }}>
                <GlassView
                  style={[
                    styles.cancelButton,
                    Platform.OS !== 'ios' && {
                      backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    },
                  ]}
                  glassEffectStyle="clear"
                >
                  <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancel Edit</Text>
                </GlassView>
              </Pressable>
            )}

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
                <IconSymbol
                  name={editingDocument ? 'checkmark.circle.fill' : 'arrow.up.circle.fill'}
                  color={theme.colors.primary}
                  size={24}
                />
                <Text style={[styles.uploadButtonText, { color: theme.colors.primary }]}>
                  {editingDocument ? 'Update Document' : 'Upload Document'}
                </Text>
              </GlassView>
            </Pressable>
          </GlassView>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {allDocuments.length === 0 ? (
            <GlassView
              style={[
                styles.emptyState,
                Platform.OS !== 'ios' && {
                  backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="doc.text" color={theme.dark ? '#98989D' : '#666'} size={64} />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>No Documents</Text>
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#98989D' : '#666' }]}>
                Upload your first document to get started
              </Text>
            </GlassView>
          ) : (
            allDocuments.map((doc) => (
              <GlassView
                key={doc.id}
                style={[
                  styles.documentCard,
                  Platform.OS !== 'ios' && {
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  },
                ]}
                glassEffectStyle="regular"
              >
                <View style={styles.documentHeader}>
                  <View style={[styles.documentIcon, { backgroundColor: getDocumentTypeColor(doc.type) + '20' }]}>
                    <IconSymbol name={getDocumentTypeIcon(doc.type)} color={getDocumentTypeColor(doc.type)} size={24} />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={[styles.documentTitle, { color: theme.colors.text }]} numberOfLines={1}>
                      {doc.title}
                    </Text>
                    <Text style={[styles.documentMeta, { color: theme.dark ? '#98989D' : '#666' }]}>
                      {doc.subject} • {doc.level}
                    </Text>
                  </View>
                </View>

                {doc.description && (
                  <Text style={[styles.documentDescription, { color: theme.dark ? '#98989D' : '#666' }]} numberOfLines={2}>
                    {doc.description}
                  </Text>
                )}

                <View style={styles.documentFooter}>
                  <Text style={[styles.documentDate, { color: theme.dark ? '#98989D' : '#666' }]}>
                    Uploaded: {doc.uploadDate}
                  </Text>
                  <View style={styles.documentActions}>
                    <Pressable onPress={() => handleEdit(doc)} style={styles.actionButton}>
                      <IconSymbol name="pencil" color={theme.colors.primary} size={20} />
                    </Pressable>
                    <Pressable onPress={() => handleDelete(doc)} style={styles.actionButton}>
                      <IconSymbol name="trash" color="#FF3B30" size={20} />
                    </Pressable>
                  </View>
                </View>
              </GlassView>
            ))
          )}
        </ScrollView>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  tabActive: {
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.5)',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
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
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  emptyState: {
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  documentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 14,
  },
  documentDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  documentDate: {
    fontSize: 13,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
});
