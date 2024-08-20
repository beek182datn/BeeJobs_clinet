import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, BackHandler, TextInput, Button, Image, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { findCompanyById, sendMessage as apiSendMessage, getMessages, getChatRoomInfo, checkChatRoom } from '@/components/fetch_data/api';
import { ChatRoomModel, Company, User } from '@/components/Model/Model';
import { Ionicons } from '@expo/vector-icons';
import socket, { listenForNewMessages } from '@/components/fetch_data/config';
import { ReanimatedFlatList } from 'react-native-reanimated/lib/typescript/reanimated2/component/FlatList';
interface Message {
    _id: string;
    content: string;
    senderId: string;
    chatRoomId: string;
    createdAt: string;
}

const ChatRoom: React.FC = () => {
    const info = useLocalSearchParams();
    console.log('check avata: ' + JSON.stringify(info));
    const [companyInfo, setCompanyInfo] = useState<Company | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    const linkVps = 'http://beejobs.io.vn:14307';
    const [user, setUser] = useState<User | null>(null);
    const flatListRef = useRef<FlatList<Message>>(null);
    const [chatRoom, setChatRoom] = useState<ChatRoomModel | null>(null);

    const backAction = () => {
        router.back();
        return true;
    };

    const fetchData = useCallback(async () => {
        if (!info || !info.company_id || !info.userId) {
            return;
        }

        try {
            const companyInfo = await findCompanyById(String(info.company_id));
            console.log(String(info.company_id))
            if (companyInfo) {
                setCompanyInfo(companyInfo);
            }

            // Fetch messages for the chat room
            const fetchedMessages = await getMessages(String(info.userId), String(info.company_id));
            setMessages(fetchedMessages);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [fetchData]);

    useEffect(() => {
        if (chatRoom) {
            // Socket.IO setup
            socket.emit('joinRoom', String(chatRoom._id)); // Tham gia phòng chat
            // console.log('Socket connected ', String(chatRoom._id));

            // Lắng nghe sự kiện message
            socket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
                // Scroll to the end when messages change
                flatListRef.current?.scrollToEnd({ animated: true });
                console.log('new message', message.content);
            });

        }

        return () => {
            if (chatRoom) {
                socket.emit('leaveRoom', String(chatRoom._id));
            }
            // socket.off('newMessage');
        };
    }, [chatRoom]);

    const handleSendMessage = async () => {
        if (!chatRoom) {
            const chatRoomInfo = await checkChatRoom(String(info.userId), String(info.company_id));
            if (chatRoomInfo) {
                setChatRoom(chatRoomInfo);
                if (newMessage.trim()) {
                    const message: Omit<Message, '_id'> = {
                        content: newMessage,
                        senderId: String(info.userId),
                        chatRoomId: String(chatRoomInfo._id),
                        createdAt: new Date().toISOString(),
                    };

                    try {
                        const sentMessage = await apiSendMessage(message.senderId, String(info.company_id), message.content);
                        // Gửi tin nhắn qua Socket.IO
                        socket.emit('newMessage', sentMessage); // Gửi tin nhắn đến server

                        // setMessages((prevMessages) => [...prevMessages, sentMessage]);
                        setNewMessage('');
                    } catch (error) {
                        console.error('Error sending message:', error);
                    }
                }
            }
        }
        if (newMessage.trim() && chatRoom) {
            const message: Omit<Message, '_id'> = {
                content: newMessage,
                senderId: String(info.userId),
                chatRoomId: String(chatRoom._id),
                createdAt: new Date().toISOString(),
            };

            try {
                const sentMessage = await apiSendMessage(message.senderId, String(info.company_id), message.content);
                // Gửi tin nhắn qua Socket.IO
                socket.emit('newMessage', sentMessage); // Gửi tin nhắn đến server

                // setMessages((prevMessages) => [...prevMessages, sentMessage]);
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
            keyboardVerticalOffset={70}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.headerTitle}>
                    <TouchableOpacity onPress={() => { router.back(); }} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={22} color="black" />
                    </TouchableOpacity>
                    <Image
                        source={info.company_logo ? { uri: linkVps + info.company_logo }: companyInfo?.company_logo ? { uri: linkVps + companyInfo?.company_logo } : require('../../assets/images/SplashLogo.png')}
                        style={styles.logo}
                    />
                    <View style={styles.viewTitle}>
                        <Text style={styles.textTitle}>{info.company_name ? info.company_name : companyInfo?.company_name ? companyInfo?.company_name : 'Doanh nghiệp ?'}</Text>
                        <Text>{info.type === 'DN' ? 'Tài khoản doanh nghiệp' : info.type === 'ADMIN' ? 'Tài khoản quản trị' : 'Tài khoản doanh nghiệp'}</Text>
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={item.senderId === info.userId ? styles.myMessage : styles.otherMessage}>
                            <View style={styles.messageContainer}>
                                {item.senderId !== info.userId &&
                                    <Image
                                        source={info.company_logo ? { uri: linkVps + info.company_logo }: companyInfo?.company_logo ? { uri: linkVps + companyInfo?.company_logo } : require('../../assets/images/SplashLogo.png')}
                                        style={styles.avatar}
                                    />}
                                <View>
                                    <Text style={styles.messageContent}>{item.content}</Text>
                                    <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    style={styles.messageList}
                    contentContainerStyle={{ paddingBottom: 100 }}
                // initialScrollIndex={messages.length - 1} // Bắt đầu từ phần tử cuối cùng
                // onScrollToIndexFailed={(info) => {
                //     // Xử lý trường hợp không thể cuộn đến chỉ số
                //     console.log('Scroll failed', info);
                // }}
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
        backgroundColor: '#f9f9f9', // Màu nền nhẹ
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
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    messageContent: {
        fontSize: 16,
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
        alignSelf: 'flex-end',
        marginTop: 5,
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
        backgroundColor: '#fff', // Nền ô nhập
        maxHeight: 150
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 30,
    },
    messageContainer: {
        flexDirection: 'row', // Đặt hướng hàng
        alignItems: 'center', // Căn giữa dọc
    },
    avatar: {
        width: 30, // Kích thước chiều rộng
        height: 30, // Kích thước chiều cao
        borderRadius: 20, // Bo tròn
        marginRight: 10, // Khoảng cách giữa ảnh và nội dung
    },
    textContainer: {
        flex: 1, // Chiếm không gian còn lại
    }
});