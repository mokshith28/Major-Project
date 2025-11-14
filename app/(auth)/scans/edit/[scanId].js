import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ToastAndroid,
  SafeAreaView,
  StatusBar,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAppStore } from '../../../../src/store/AppStore';
import { copyToClipboard } from '../../../../src/utils';
import EditScanStyles from './EditScanStyles';
import { API_CONFIG, APP_CONFIG } from '../../../../src/config/index';

export default function EditScan() {
  const { scanId } = useLocalSearchParams();
  const { savedScans, updateScan } = useAppStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Find the scan by timestamp (using as ID)
  const scan = savedScans.find(s => s.timestamp.toString() === scanId);

  const [editedText, setEditedText] = useState(scan?.text || '');
  const [isModified, setIsModified] = useState(false);
  const [summary, setSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [questions, setQuestions] = useState([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const summarizeText = async (text) => {
    try {
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_CONFIG.HUGGINGFACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: text,
            provider: "hf-inference"
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);

        if (response.status === 503) {
          return "Model is loading. Please wait 20 seconds and try again.";
        } else if (response.status === 401 || response.status === 403) {
          return "Invalid API token. Please check your Hugging Face token has 'Inference Providers' permission.";
        }

        return `Error: ${response.status} - ${errorText}`;
      }

      const result = await response.json();

      // API returns array with summary_text
      if (Array.isArray(result) && result.length > 0 && result[0]?.summary_text) {
        console.log("✅ Summary generated successfully");
        return result[0].summary_text;
      } else if (result?.summary_text) {
        return result.summary_text;
      }

      console.error("Unexpected response format:", result);
      return "Could not generate summary.";
    } catch (error) {
      console.error("Summarization error:", error);
      return `Error: ${error.message}`;
    }
  };

  // Update edited text when scan changes (in case it gets updated)
  useEffect(() => {
    if (scan && scan.text !== editedText && !isModified) {
      setEditedText(scan.text);
    }
  }, [scan?.text, editedText, isModified]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  if (!scan) {
    return (
      <View style={[EditScanStyles.notFoundContainer, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={EditScanStyles.statusBar.backgroundColor} />
        <Text style={EditScanStyles.notFoundText}>Scan not found</Text>
        <TouchableOpacity
          style={EditScanStyles.notFoundButton}
          onPress={() => router.back()}
        >
          <Text style={EditScanStyles.notFoundButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTextChange = (text) => {
    setEditedText(text);
    setIsModified(text !== scan.text);
  };

  const handleCopy = () => {
    copyToClipboard(editedText);
  };

  const handleSave = async () => {
    if (!editedText.trim()) {
      Alert.alert('Error', 'Text cannot be empty');
      return;
    }

    // Create updated scan object
    const updatedScan = {
      ...scan,
      text: editedText.trim(),
      date: new Date().toLocaleDateString(), // Update date to show it was modified
    };

    router.back();

    // Update scan in place to avoid "scan not found" flash
    await updateScan(scan, updatedScan);

    // Show success message
    if (Platform.OS === 'android') {
      ToastAndroid.show('Scan updated successfully!', ToastAndroid.SHORT);
    } else {
      Alert.alert('✅ Success!', 'Scan updated successfully!');
    }
  };

  const handleDiscard = () => {
    if (isModified) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSummerize = async () => {
    if (!editedText.trim()) {
      Alert.alert("Error", "Text is empty, nothing to summarize.");
      return;
    }

    setIsSummarizing(true);
    try {
      const result = await summarizeText(editedText);
      setSummary(result);
      setShowSummaryModal(true);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!editedText.trim()) {
      Alert.alert("Error", "No text to read.");
      return;
    }

    if (isSpeaking) {
      // Stop speaking
      Speech.stop();
      setIsSpeaking(false);
    } else {
      // Start speaking
      setIsSpeaking(true);
      Speech.speak(editedText, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          Alert.alert("Error", "Could not read text aloud.");
        }
      });
    }
  };

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await fetch(
        `${API_CONFIG.GOOGLE_TRANSLATE_URL}?key=${API_CONFIG.GOOGLE_VISION_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            format: 'text'
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Translation API Error:', error);
        throw new Error('Translation failed');
      }

      const result = await response.json();
      return result.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  };

  const handleTranslate = async (languageCode) => {
    if (!editedText.trim()) {
      Alert.alert("Error", "No text to translate.");
      return;
    }

    setIsTranslating(true);
    setSelectedLanguage(languageCode);

    try {
      const translated = await translateText(editedText, languageCode);
      setTranslatedText(translated);
      setShowTranslateModal(true);
    } catch (error) {
      Alert.alert("Error", "Translation failed. Please make sure Google Cloud Translation API is enabled.");
    } finally {
      setIsTranslating(false);
    }
  };

  const generateQuestions = async (context) => {
    try {
      const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Generate exactly 5 exam-style questions from the following text. Format each question on a new line, numbered 1-5:\n\n${context}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      console.log("✅ Gemini Response:", responseText);

      // Parse the response to extract questions
      const lines = responseText.split('\n').filter(line => line.trim().length > 0);
      const questionsArray = [];

      lines.forEach((line, index) => {
        // Remove numbering like "1.", "1)", etc.
        const cleanLine = line.replace(/^\d+[\.\)\-]\s*/, '').trim();
        if (cleanLine.length > 10) { // Valid question should be longer than 10 chars
          questionsArray.push({
            id: questionsArray.length + 1,
            question: cleanLine
          });
        }
      });

      // Ensure we have exactly 5 questions
      return questionsArray.slice(0, 5);
    } catch (error) {
      console.error("❌ Question generation error:", error);
      throw error;
    }
  };

  const handleGenerateQuestions = async () => {
    if (!editedText.trim()) {
      Alert.alert("Error", "Text is empty, nothing to generate questions from.");
      return;
    }

    setIsGeneratingQuestions(true);
    try {
      const generatedQuestions = await generateQuestions(editedText);
      setQuestions(generatedQuestions);
      setShowQuestionsModal(true);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to generate questions. Please check your Gemini API key.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };


  return (
    <View style={[EditScanStyles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style={EditScanStyles.statusBar} />
      <ScrollView
        style={EditScanStyles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={EditScanStyles.header}>
          <TouchableOpacity
            style={EditScanStyles.backButton}
            onPress={handleDiscard}
            activeOpacity={0.8}
          >
            <Text style={EditScanStyles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={EditScanStyles.headerTitle}>Edit Scan</Text>
          <Text style={EditScanStyles.headerSubtitle}>
            📚 {scan.subject} • {scan.date}
          </Text>
        </View>

        {/* Edit Text Area */}
        <View style={EditScanStyles.textContainer}>
          <View style={EditScanStyles.textHeader}>
            <Text style={EditScanStyles.sectionTitle}>Scan Text</Text>
            <View style={EditScanStyles.headerActions}>
              {isModified && (
                <Text style={EditScanStyles.modifiedIndicator}>
                  Modified
                </Text>
              )}
              <TouchableOpacity
                style={EditScanStyles.copyButton}
                onPress={handleTextToSpeech}
              >
                <Text style={EditScanStyles.copyButtonText}>
                  {isSpeaking ? '🔇' : '🔊'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={EditScanStyles.copyButton}
                onPress={handleCopy}
              >
                <Text style={EditScanStyles.copyButtonText}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={EditScanStyles.textInput}
            value={editedText}
            onChangeText={handleTextChange}
            multiline
            placeholder="Enter scan text..."
            scrollEnabled
          />
        </View>

        {/* Action Buttons */}
        <View style={EditScanStyles.actionButtonsContainer}>
          <TouchableOpacity
            style={EditScanStyles.cancelButton}
            onPress={handleDiscard}
            activeOpacity={0.8}
          >
            <Text style={EditScanStyles.cancelButtonText}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              EditScanStyles.saveButton,
              isModified ? EditScanStyles.saveButtonEnabled : EditScanStyles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!isModified}
            activeOpacity={0.8}
          >
            <Text style={EditScanStyles.saveButtonText}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
        <View style={EditScanStyles.summerizerButtonContainer}>
          <TouchableOpacity
            style={[
              EditScanStyles.summerizeButton,
              isSummarizing && { backgroundColor: "#aaa" }, // grey out while loading
            ]}
            onPress={handleSummerize}
            disabled={isSummarizing}
          >
            <Text style={EditScanStyles.summerizeButtonText}>
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Translate Button */}
        <View style={EditScanStyles.summerizerButtonContainer}>
          <TouchableOpacity
            style={[
              EditScanStyles.summerizeButton,
              { backgroundColor: "#28a745" },
              isTranslating && { backgroundColor: "#aaa" },
            ]}
            onPress={() => setShowTranslateModal(true)}
            disabled={isTranslating}
          >
            <Text style={EditScanStyles.summerizeButtonText}>
              {isTranslating ? "Translating..." : "🌐 Translate"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Generate Questions Button */}
        <View style={EditScanStyles.summerizerButtonContainer}>
          <TouchableOpacity
            style={[
              EditScanStyles.summerizeButton,
              { backgroundColor: "#17a2b8" },
              isGeneratingQuestions && { backgroundColor: "#aaa" },
            ]}
            onPress={handleGenerateQuestions}
            disabled={isGeneratingQuestions}
          >
            <Text style={EditScanStyles.summerizeButtonText}>
              {isGeneratingQuestions ? "Generating..." : "❓ Generate Questions"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* // Summerizer Modal */}
      {showSummaryModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "90%",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 22, marginBottom: 10 }}>
              📖 Summary
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={{ fontSize: 16 }}>{summary}</Text>
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "#007bff",
                padding: 10,
                borderRadius: 8,
                alignSelf: "flex-end",
              }}
              onPress={() => setShowSummaryModal(false)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Translate Modal */}
      {showTranslateModal && !translatedText && (
        <Modal
          visible={showTranslateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTranslateModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}>
            <View style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "90%",
              maxHeight: "80%",
            }}>
              <Text style={{ fontWeight: "bold", fontSize: 22, marginBottom: 15 }}>
                🌐 Translate to...
              </Text>
              <ScrollView style={{ maxHeight: 400 }}>
                {APP_CONFIG.TRANSLATE_LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={{
                      padding: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() => handleTranslate(lang.code)}
                  >
                    <Text style={{ fontSize: 24, marginRight: 10 }}>{lang.flag}</Text>
                    <Text style={{ fontSize: 18 }}>{lang.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  backgroundColor: "#6c757d",
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={() => setShowTranslateModal(false)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Translated Text Modal */}
      {translatedText && (
        <Modal
          visible={!!translatedText}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setTranslatedText('');
            setShowTranslateModal(false);
          }}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}>
            <View style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "90%",
            }}>
              <Text style={{ fontWeight: "bold", fontSize: 22, marginBottom: 10 }}>
                🌐 Translation ({APP_CONFIG.TRANSLATE_LANGUAGES.find(l => l.code === selectedLanguage)?.name})
              </Text>
              <ScrollView style={{ maxHeight: 300 }}>
                <Text style={{ fontSize: 16, lineHeight: 24 }}>{translatedText}</Text>
              </ScrollView>
              <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#007bff",
                    padding: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    copyToClipboard(translatedText);
                    if (Platform.OS === 'android') {
                      ToastAndroid.show('Translation copied!', ToastAndroid.SHORT);
                    }
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>📋 Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#6c757d",
                    padding: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setTranslatedText('');
                    setShowTranslateModal(false);
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Questions Modal */}
      {showQuestionsModal && (
        <Modal
          visible={showQuestionsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowQuestionsModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}>
            <View style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "90%",
              maxHeight: "80%",
            }}>
              <Text style={{ fontWeight: "bold", fontSize: 22, marginBottom: 15 }}>
                ❓ Study Questions ({questions.length})
              </Text>
              <ScrollView style={{ maxHeight: 400 }}>
                {questions.map((q) => (
                  <View
                    key={q.id}
                    style={{
                      padding: 15,
                      marginBottom: 10,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 8,
                      borderLeftWidth: 4,
                      borderLeftColor: "#17a2b8",
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#17a2b8" }}>
                      Q{q.id}
                    </Text>
                    <Text style={{ fontSize: 16, marginTop: 5, lineHeight: 22 }}>
                      {q.question}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#007bff",
                    padding: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    const questionsText = questions.map((q, i) => `Q${i + 1}: ${q.question}`).join('\n\n');
                    copyToClipboard(questionsText);
                    if (Platform.OS === 'android') {
                      ToastAndroid.show('Questions copied!', ToastAndroid.SHORT);
                    }
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>📋 Copy All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#28a745",
                    padding: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={handleGenerateQuestions}
                  disabled={isGeneratingQuestions}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>🔄 Regenerate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#6c757d",
                    padding: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={() => setShowQuestionsModal(false)}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
}
