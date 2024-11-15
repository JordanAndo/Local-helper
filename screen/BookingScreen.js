import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { db, auth } from '../Firebase/firebaseConfig';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon
import { AirbnbRating } from 'react-native-ratings'; // Import Star Rating

const imageMap = {
  'qEgiKTovsn6OwWMbhtV3': require('../assets/image/cleaning1.png'),
  'xMzhyDPCzuq7CnexMl74': require('../assets/image/cleaning2.png'),
  'nkVtiuVIondPpMuiUK8U': require('../assets/image/cleaning3.png'),
  'ZVvmlqUcKZlpi85IeC33': require('../assets/image/cleaning4.png'),
  '4oTtspwW2lHmok9krCoW': require('../assets/image/repairing1.png'),
  'R1D9hJweATK1ltjzrqbc': require('../assets/image/repairing2.png'),
  '37IiCBqNddOZGRiNI09J': require('../assets/image/painting1.png'),
  'VeecBj9llRRgnGCTJsX3': require('../assets/image/painting2.png'),
  'XdxL8pbYHirCUuxC4Ye3': require('../assets/image/plumbing1.png'),
  'GuK5yrUOKnqpBhS8Pw3Z': require('../assets/image/plumbing2.png'),
};

export default function BookingScreen() {
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0); // For storing rating

  const fetchBookings = async () => {
    if (!auth.currentUser) return;

    const email = auth.currentUser.email;
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const allBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const userBookings = allBookings.filter(booking => {
        const [bookingEmail] = booking.id.split('_'); // Extract email from the id
        return bookingEmail === email;
      });

      const sortedBookings = userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const deleteBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking: ", error);
    }
  };

  const showDeleteOption = (bookingId) => {
    Alert.alert(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteBooking(bookingId), style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  const openReviewModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setModalVisible(true);
  };

  const submitReview = async () => {
    if (!selectedBookingId) return;

    try {
      const bookingRef = doc(db, 'bookings', selectedBookingId);
      await updateDoc(bookingRef, {
        review: reviewText,
        rating: rating,
      });
      setModalVisible(false); // Close modal after submitting
      Alert.alert('Review Submitted', 'Thank you for your review!');
      setReviewText(''); // Clear the review text
      setRating(0); // Reset rating
    } catch (error) {
      console.error("Error submitting review: ", error);
    }
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingContainer}>
      <Image
        source={imageMap[item.serviceId] || { uri: 'https://via.placeholder.com/80' }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{item.serviceName}</Text>
        <Text style={styles.amount}>Total Amount: ${item.totalAmount}</Text>

        {/* Status Button - Green for Booked, Red for Completed */}
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.status === 'Booked' && styles.bookedStatus,
            item.status === 'Completed' && styles.completedStatus
          ]}
          onPress={() => {
            if (item.status === 'Booked') {
              // Here, you might want to add logic to change status if needed
            }
          }}
        >
          <Text style={styles.statusButtonText}>
            {item.status === 'Completed' ? 'Completed' : item.status}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ellipsis icon in the right corner with delete option */}
      <TouchableOpacity style={styles.ellipsisButton} onPress={() => showDeleteOption(item.id)}>
        <Icon name="ellipsis-vertical" size={24} color="black" />
      </TouchableOpacity>

      {/* Review Button - Show only if status is Completed */}
      {item.status === 'Completed' && (
        <TouchableOpacity style={styles.reviewButton} onPress={() => openReviewModal(item.id)}>
          <Text style={styles.reviewButtonText}>Review</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshBookings} />}
        />
      ) : (
        <Text>No bookings available.</Text>
      )}

      {/* Modal for Review */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your review</Text>
            
            {/* Input Box for Review */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review..."
              multiline={true}
              value={reviewText}
              onChangeText={setReviewText}
            />

            {/* Star Rating */}
            <AirbnbRating
              count={5}
              defaultRating={0}
              size={20} // Small star size
              showRating={false} // Hide default rating labels
              onFinishRating={setRating}
            />

            {/* Send Button */}
            <TouchableOpacity style={styles.sendButton} onPress={submitReview}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bookingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    marginBottom: 10,
  },
  statusButton: {
    backgroundColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bookedStatus: {
    backgroundColor: 'green',
  },
  completedStatus: {
    backgroundColor: 'red',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  reviewButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginLeft: 10,
    bottom:-40,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  ellipsisButton: {
    position: 'absolute',
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

