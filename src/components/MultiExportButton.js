import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { ExportService } from '../services';

const MultiExportButton = ({
  scans,
  subjectName,
  style,
  textStyle,
  onExportStart,
  onExportComplete,
  onExportError,
  disabled = false,
  showIcon = true,
  customText
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleMultiExport = async () => {
    if (disabled || isExporting || !scans || scans.length === 0) return;

    try {
      setIsExporting(true);
      onExportStart && onExportStart();

      // Export each scan individually using the single export method
      let successCount = 0;
      for (let i = 0; i < scans.length; i++) {
        const success = await ExportService.exportScanWithFormatSelection(scans[i], i);
        if (success) successCount++;
      }

      if (successCount > 0) {
        Alert.alert('Export Complete', `${successCount} out of ${scans.length} scans exported successfully.`);
        onExportComplete && onExportComplete();
      } else {
        onExportError && onExportError('No scans were exported');
      }
    } catch (error) {
      console.error('Multi export error:', error);
      onExportError && onExportError(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonText = () => {
    if (customText) return customText;
    if (isExporting) return showIcon ? '⏳ Exporting...' : 'Exporting All...';
    return showIcon ? `📤 Export All (${scans?.length || 0})` : `Export All (${scans?.length || 0})`;
  };

  const getButtonStyle = () => {
    const baseStyle = style || {
      backgroundColor: '#007AFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      margin: 10,
    };

    return [
      baseStyle,
      (disabled || isExporting || !scans || scans.length === 0) && { opacity: 0.5 }
    ];
  };

  const getTextStyle = () => {
    return textStyle || {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handleMultiExport}
      disabled={disabled || isExporting || !scans || scans.length === 0}
    >
      <Text style={getTextStyle()}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
};

export default MultiExportButton;
