import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { createTask } from '@/services/offline';
import { useNetwork } from '@/context/NetworkContext';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';

export default function NewTaskScreen() {
  const { isConnected } = useNetwork();
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('Open');
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async () => {
    if (isConnected === null) {
      Alert.alert('Error', 'Cannot create task while network status is unknown.');
      return;
    }
    if (!subject) {
      Alert.alert('Error', 'Subject is required.');
      return;
    }
    setLoading(true);
    try {
      const result = await createTask(isConnected, {
        subject: subject,
        status: status,
      });
      if (result.offline) {
        Alert.alert('Success', 'Task data saved locally and will be synced when online.');
      } else {
        Alert.alert('Success', 'Task created successfully.');
      }
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="Enter task subject"
      />
      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="Enter status"
      />
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      ) : (
        <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
          <Text style={styles.createButtonText}>Create Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
