import AsyncStorage from '@react-native-async-storage/async-storage';

// Default subjects list
export const DEFAULT_SUBJECTS = [];

// Subjects management functions
export const getStoredSubjects = async () => {
  try {
    const stored = await AsyncStorage.getItem('customSubjects');
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_SUBJECTS;
  } catch (error) {
    return DEFAULT_SUBJECTS;
  }
};

export const saveSubjects = async (subjects) => {
  try {
    await AsyncStorage.setItem('customSubjects', JSON.stringify(subjects));
    return true;
  } catch (error) {
    return false;
  }
};

export const addNewSubject = async (newSubject, currentSubjects) => {
  if (!newSubject.trim() || currentSubjects.includes(newSubject.trim())) {
    return { success: false, subjects: currentSubjects };
  }

  const updatedSubjects = [...currentSubjects, newSubject.trim()].sort();
  const success = await saveSubjects(updatedSubjects);

  return {
    success,
    subjects: success ? updatedSubjects : currentSubjects
  };
};

export const removeSubject = async (subjectToRemove, currentSubjects) => {
  const updatedSubjects = currentSubjects.filter(subject => subject !== subjectToRemove);
  const success = await saveSubjects(updatedSubjects);

  return {
    success,
    subjects: success ? updatedSubjects : currentSubjects
  };
};
