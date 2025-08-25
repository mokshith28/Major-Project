import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Alert } from 'react-native';

class ExportService {
  /**
   * Show format selection dialog and export accordingly
   */
  static async exportScanWithFormatSelection(scan, index) {
    return new Promise((resolve) => {
      Alert.alert(
        'Export Format',
        'Choose the format for your export:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'TXT',
            onPress: async () => {
              const success = await this.exportScanAsTXT(scan, index);
              resolve(success);
            },
          },
          {
            text: 'PDF',
            onPress: async () => {
              const success = await this.exportScanAsPDF(scan, index);
              resolve(success);
            },
          },
        ],
        { cancelable: true, onDismiss: () => resolve(false) }
      );
    });
  }

  /**
   * Export scan as TXT file
   */
  static async exportScanAsTXT(scan, index) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `Scan_${index + 1}_${timestamp}.txt`;
      const content = this.formatScanContent(scan);
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Export Scan Text'
        });
      } else {
        Alert.alert('Export Successful', `File saved: ${filename}`);
      }
      return true;
    } catch (error) {
      console.error('TXT Export error:', error);
      Alert.alert('Export Failed', 'Unable to export as TXT.');
      return false;
    }
  }

  /**
   * Export scan as PDF file using expo-print
   */
  static async exportScanAsPDF(scan, index) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `Scan_${index + 1}_${timestamp}.pdf`;
      const htmlContent = this.formatScanContentForPDF(scan);

      // Generate PDF from HTML using expo-print
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      console.log("PDF generated at:", uri);

      if (uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Export Scan as PDF'
          });
        } else {
          Alert.alert('PDF Created', `PDF saved at: ${uri}`);
        }
        return true;
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (error) {
      console.error('PDF Export error:', error);
      Alert.alert('Export Failed', 'Unable to export as PDF.');
      return false;
    }
  }  /**
   * Format scan content for TXT export
   */
  static formatScanContent(scan) {
    const subject = scan.subject || 'No Subject';
    const date = scan.date || 'No Date';
    const text = scan.text || 'No text content';

    return `Subject: ${subject}
Date: ${date}
Exported: ${new Date().toLocaleString()}

Recognized Text:
${text}

---
Exported from Text Recognition App`;
  }

  /**
   * Format scan content for PDF export
   */
  static formatScanContentForPDF(scan) {
    const subject = scan.subject || 'No Subject';
    const date = scan.date || 'No Date';
    const text = scan.text || 'No text content';
    const exportTime = new Date().toLocaleString();

    // Escape HTML characters
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.5; 
        }
        .header { 
            border-bottom: 2px solid #333; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
        }
        .meta { 
            background: #f5f5f5; 
            padding: 10px; 
            margin-bottom: 20px; 
        }
        .content { 
            white-space: pre-wrap; 
            font-family: monospace; 
            border: 1px solid #ddd; 
            padding: 15px; 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Text Recognition Export</h1>
    </div>
    <div class="meta">
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Exported:</strong> ${exportTime}</p>
    </div>
    <div class="content">${escapedText}</div>
</body>
</html>`;
  }
}

export default ExportService;
