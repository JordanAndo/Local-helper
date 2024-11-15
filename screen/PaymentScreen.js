import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { db, auth } from '../Firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import RadioButtonRN from 'radio-buttons-react-native';

export default function PaymentScreen({ route, navigation }) {
  const { selectedDate, selectedTime, selectedItem } = route.params;
  const [serviceDetails, setServiceDetails] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const GST_PERCENTAGE = 0.18;

  const formattedDate = selectedDate ? new Date(selectedDate) : null; // Convert received date

  const paymentOptions = [
    { label: 'GPay' },
    { label: 'Cash on Delivery' }
  ];

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const serviceDocRef = doc(db, 'plumbing', selectedItem.id);
        const cleaningDocRef = doc(db, 'cleaning', selectedItem.id);
        const repairingDocRef = doc(db, 'repairing', selectedItem.id);
        const paintingDocRef = doc(db, 'painting', selectedItem.id);

        let docSnap = await getDoc(serviceDocRef);
        if (!docSnap.exists()) docSnap = await getDoc(cleaningDocRef);
        if (!docSnap.exists()) docSnap = await getDoc(repairingDocRef);
        if (!docSnap.exists()) docSnap = await getDoc(paintingDocRef);

        if (docSnap.exists()) {
          setServiceDetails(docSnap.data());
        } else {
          Alert.alert("No Data Found", "No data exists for the selected service.");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Error", "Error fetching service details. Please try again.");
      }
    };

    fetchServiceDetails();
  }, [selectedItem.id, navigation]);

  const handlePaymentConfirmation = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to confirm the payment.");
      return;
    }

    const email = auth.currentUser.email;
    const bookingId = `${email}_${selectedItem.id}_${Date.now()}`;
    const serviceAmount = parseFloat(serviceDetails.amount);
    const gstAmount = serviceAmount * GST_PERCENTAGE;
    const totalAmount = serviceAmount + gstAmount;

    const paymentData = {
      serviceId: selectedItem.id,
      serviceName: serviceDetails.name,
      email: email,
      serviceAmount: serviceAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      createdAt: new Date().toISOString(),
      selectedDate: formattedDate ? formattedDate.toDateString() : "Invalid Date",
      selectedTime: selectedTime,
      status: 'Booked',
      paymentMethod: selectedPaymentMethod,
      image: serviceDetails.image || null,
    };

    try {
      await setDoc(doc(db, 'bookings', bookingId), paymentData);
      Alert.alert("Success", "Payment confirmed successfully!");
      navigation.navigate("Booking");
    } catch (error) {
      Alert.alert("Error", "Error saving payment details. Please try again.");
    }
  };

  if (!serviceDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const serviceAmount = parseFloat(serviceDetails.amount);
  const gstAmount = serviceAmount * GST_PERCENTAGE;
  const totalAmount = serviceAmount + gstAmount;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Payment Details</Text>
      <Text style={styles.detailText}>Service: {serviceDetails.name}</Text>
      <Text style={[styles.detailText, { marginTop: 15 }]}>Selected Date: {formattedDate ? formattedDate.toDateString() : "Invalid Date"}</Text>
      <Text style={styles.detailText}>Selected Time: {selectedTime}</Text>
      <Text style={styles.detailText}>Service Amount: ${serviceAmount.toFixed(2)}</Text>
      <Text style={styles.detailText}>GST (18%): ${gstAmount.toFixed(2)}</Text>

      <View style={styles.horizontalLine} />

      <Text style={styles.totalAmountText}>Total Amount: ${totalAmount.toFixed(2)}</Text>
      <Text style={styles.header}>Payment Method</Text>
      <RadioButtonRN
        data={paymentOptions}
        selectedBtn={(e) => setSelectedPaymentMethod(e.label)}
        box={false}
        activeColor="#A64BF4"
        style={styles.radioContainer}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handlePaymentConfirmation}>
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 15,
  },
  confirmButton: {
    backgroundColor: '#A64BF4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  radioContainer: {
    width: '100%',
    marginTop: 10,
  },
});
