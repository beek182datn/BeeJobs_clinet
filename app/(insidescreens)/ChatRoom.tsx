import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput, Button, Image, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { findCompanyById, sendMessage as apiSendMessage, getMessages } from '@/components/fetch_data/api';
import { Company, User } from '@/components/Model/Model';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import socket from '@/components/fetch_data/config';
interface Message {
    _id: string;
    content: string;
    senderId: string;
    chatRoomId: string;
    createdAt: string;
}

const ChatRoom: React.FC = () => {
    const info = useLocalSearchParams();
    const [companyInfo, setCompanyInfo] = useState<Company | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const linkVps = 'http://beejobs.io.vn:14307';
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            const companyInfo = await findCompanyById(String(info.company_id));
            if (companyInfo) {
                setCompanyInfo(companyInfo);
            }

            // Fetch messages for the chat room
            if (info) {
                const fetchedMessages = await getMessages(String(info.userId), String(info.company_id));
                setMessages(fetchedMessages);
            }
            // Socket.IO setup
            socket.emit('joinRoom', String(info.company_id)); // Tham gia phòng chat
        };

        fetchData();


        // Lắng nghe sự kiện message
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect(); // Ngắt kết nối khi component unmount
        };
    }, []);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const message: Omit<Message, '_id'> = {
                content: newMessage,
                senderId: String(info.userId),
                chatRoomId: String(info.company_id),
                createdAt: new Date().toISOString(),
            };

            try {
                const sentMessage = await apiSendMessage(message.senderId, String(info.company_id), message.content);
                // Gửi tin nhắn qua Socket.IO
                socket.emit('newMessage', sentMessage); // Gửi tin nhắn đến server

                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.headerTitle}>
                    <TouchableOpacity onPress={() => { router.back(); }} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={22} color="black" />
                    </TouchableOpacity>
                    <Image
                        source={companyInfo?.company_logo ? { uri: linkVps + companyInfo.company_logo } : require('../../assets/images/SplashLogo.png')}
                        style={styles.logo}
                    />
                    <View style={styles.viewTitle}>
                        <Text style={styles.textTitle}>{companyInfo?.company_name}</Text>
                        <Text>Tài khoản doanh nghiệp</Text>
                    </View>
                </View>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={item.senderId === info.userId ? styles.myMessage : styles.otherMessage}>
                            <Text>{item.content}</Text>
                        </View>
                    )}
                    style={styles.messageList}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline={true}
                    />
                    <Button title="Gửi" onPress={handleSendMessage} />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default ChatRoom;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerTitle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
        paddingBottom: 10,
    },
    viewTitle: {
        marginLeft: 20,
    },
    textTitle: {
        color: 'black',
        fontSize: 18,
        fontWeight: '500',
    },
    messageList: {
        flex: 1,
        marginVertical: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1ffd1',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 30,
    }
});
