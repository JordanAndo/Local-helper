import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, FlatList, ToastAndroid, KeyboardAvoidingView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

export default function DateTimePickerScreen({ route, navigation }) {
  const { selectedItem } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeList, setTimeList] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const timelist = [];
    for (let i = 8; i <= 12; i++) {
      timelist.push({ time: `${i}:00 AM` });
      timelist.push({ time: `${i}:30 AM` });
    }
    for (let i = 1; i <= 7; i++) {
      timelist.push({ time: `${i}:00 PM` });
      timelist.push({ time: `${i}:30 PM` });
    }
    setTimeList(timelist);
  }, []);

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      ToastAndroid.show('Please select Date and Time', ToastAndroid.LONG);
      return;
    }

    // Log selectedDate to debug
    console.log('Selected Date:', selectedDate);

    // Navigate to Payment with formatted date
    navigation.navigate('Payment', {
      selectedDate: moment(selectedDate).format('YYYY-MM-DD'), // Send in a more standard format
      selectedTime,
      note,
      selectedItem,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView style={{ padding: 20 }}>
        {/* Calendar Picker */}
        <Text style={[styles.header, { marginTop: -70 }]}>Select Date</Text>
        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={date => setSelectedDate(date)} // Ensure date is correctly set
            width={300}
            minDate={new Date()} // Use new Date() to ensure it is a Date object
            todayBackgroundColor="#FF6347"
            todayTextStyle={{ color: 'white' }}
            selectedDayColor="black"
            selectedDayTextColor="white"
          />
        </View>

        {/* Time Slot Picker */}
        <Text style={[styles.header, { marginTop: 30 }]}>Select Time Slot</Text>
        <FlatList
          data={timeList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setSelectedTime(item.time)}>
              <Text style={[selectedTime === item.time ? styles.selectedTime : styles.unselectedTime]}>
                {item.time}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Suggestion Note Input */}
        <Text style={[styles.header, { marginTop: 30 }]}> Suggestion Note</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Note"
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* Confirm Button */}
        <View style={styles.confirmButtonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
            <Text style={styles.confirmButtonText}>Confirm & Book</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  calendarContainer: {
    backgroundColor: '#FFF3F1',
    padding: 20,
    borderRadius: 15,
  },
  selectedTime: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#A64BF4',
    borderRadius: 99,
    paddingHorizontal: 18,
    backgroundColor: '#A64BF4',
    color: 'white',
  },
  unselectedTime: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#A64BF4',
    borderRadius: 99,
    paddingHorizontal: 18,
    color: '#A64BF4',
  },
  noteInput: {
    borderColor: '#A64BF4',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  confirmButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#A64BF4',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
