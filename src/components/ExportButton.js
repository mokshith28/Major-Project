import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { ExportService } from '../services';
import YourScansScreenStyles from '../styles/YourScansScreenStyles';

const ExportButton = ({
  scan,
  index,
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

  const handleExport = async () => {
    if (disabled || isExporting) return;

    try {
      setIsExporting(true);
      onExportStart && onExportStart();

      const success = await ExportService.exportScanWithFormatSelection(scan, index);

      if (success) {
        onExportComplete && onExportComplete();
      } else {
        onExportError && onExportError('Export failed');
      }
    } catch (error) {
      console.error('Export button error:', error);
      onExportError && onExportError(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonText = () => {
    if (customText) return customText;
    if (isExporting) return showIcon ? '⏳' : 'Exporting...';
    return showIcon ? '📤' : 'Export';
  };

  const getButtonStyle = () => {
    const baseStyle = style || YourScansScreenStyles.exportButton;
    return [
      baseStyle,
      (disabled || isExporting) && { opacity: 0.5 }
    ];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handleExport}
      disabled={disabled || isExporting}
    >
      <Text style={textStyle || YourScansScreenStyles.exportButtonText}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
};

export default ExportButton;
