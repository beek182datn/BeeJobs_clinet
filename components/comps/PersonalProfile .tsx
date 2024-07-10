import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';

interface PersonalProfileProps { }

const PersonalProfile: React.FC<PersonalProfileProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const [worker_name, setWorkerName] = useState('');
  const [worker_avatar, setWorkerAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleAddProfile = () => {
    setShowModal(true);
  };

  const handleSaveProfile = () => {
    // Xử lý lưu thông tin profile ở đây
    console.log({
      worker_name,
      worker_avatar,
      phone,
      email,
    });
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.scene}>
      <Text>Hồ sơ</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tên"
            value={worker_name}
            onChangeText={setWorkerName}
          />
          <TextInput
            style={styles.input}
            placeholder="Ảnh đại diện"
            value={worker_avatar}
            onChangeText={setWorkerAvatar}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PersonalProfile;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
