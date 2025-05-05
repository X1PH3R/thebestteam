import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useJoinedClubs } from '../context/JoinedClubsContext';

type RootStackParamList = {
  GroupChat: { clubId: string; clubName: string };
};

type GroupChatRouteProp = RouteProp<RootStackParamList, 'GroupChat'>;

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
}

const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;

const GroupChatScreen = () => {
  const route = useRoute<GroupChatRouteProp>();
  const { clubId, clubName } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const { joinedClubs } = useJoinedClubs();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? 0 : 1;
    setIsDrawerOpen(!isDrawerOpen);
    Animated.spring(drawerAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  // Mock data - Replace with actual data fetching
  useEffect(() => {
    const mockMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
      id: String(i),
      text: `This is message ${i + 1}. Some longer text to test the layout and wrapping of messages in our chat interface.`,
      userId: i % 2 === 0 ? 'user1' : 'user2',
      userName: i % 2 === 0 ? 'John Doe' : 'Jane Smith',
      timestamp: Date.now() - i * 1000 * 60 * 5,
    }));

    setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
    }, 1000);
  }, [clubId]); // Reload messages when club changes

  useEffect(() => {
    navigation.setOptions({
      title: clubName,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={toggleDrawer}
        >
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {/* Handle members list */}}
        >
          <Ionicons name="people-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, clubName, theme, toggleDrawer]);

  const handleSend = () => {
    if (message.trim() === '') return;

    const newMessage: Message = {
      id: String(Date.now()),
      text: message,
      userId: user?.uid || 'unknown',
      userName: user?.displayName || 'Anonymous',
      timestamp: Date.now(),
    };

    setMessages(prev => [newMessage, ...prev]);
    setMessage('');
  };

  const switchChat = (newClubId: string, newClubName: string) => {
    navigation.setParams({ clubId: newClubId, clubName: newClubName });
    toggleDrawer();
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.userId === user?.uid;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageContainer : null,
      ]}>
        <View style={[
          styles.messageContent,
          isOwnMessage ? styles.ownMessageContent : null,
          { backgroundColor: isOwnMessage ? theme.primary : theme.surface }
        ]}>
          {!isOwnMessage && (
            <Text style={[styles.userName, { color: theme.primary }]}>
              {item.userName}
            </Text>
          )}
          <Text style={[
            styles.messageText,
            { color: isOwnMessage ? '#fff' : theme.text }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : theme.textSecondary }
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  const renderChannel = ({ item: club }) => (
    <TouchableOpacity
      style={[
        styles.channelItem,
        { backgroundColor: club.id === clubId ? theme.surface : 'transparent' }
      ]}
      onPress={() => switchChat(club.id, club.name)}
    >
      <View style={styles.channelIconContainer}>
        <Text style={[styles.channelIcon, { color: theme.text }]}>
          {club.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.channelInfo}>
        <Text style={[styles.channelName, { color: theme.text }]}>{club.name}</Text>
        <Text style={[styles.channelDescription, { color: theme.textSecondary }]} numberOfLines={1}>
          {club.description || 'No description'}
        </Text>
      </View>
      {club.id === clubId && (
        <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Side Drawer */}
      <Animated.View style={[
        styles.drawer,
        {
          backgroundColor: theme.background,
          transform: [{
            translateX: drawerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-DRAWER_WIDTH, 0],
            }),
          }],
        },
      ]}>
        <View style={styles.drawerHeader}>
          <Text style={[styles.drawerTitle, { color: theme.text }]}>Channels</Text>
          <TouchableOpacity onPress={toggleDrawer}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={joinedClubs}
          renderItem={renderChannel}
          keyExtractor={club => club.id}
          contentContainerStyle={styles.channelList}
        />
      </Animated.View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          inverted
          contentContainerStyle={styles.messagesList}
        />
        <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.background,
              color: theme.text,
            }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={theme.textSecondary}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
            onPress={handleSend}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Overlay when drawer is open */}
      {isDrawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleDrawer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  channelList: {
    paddingVertical: 8,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  channelIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channelIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  channelDescription: {
    fontSize: 12,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    flexDirection: 'row-reverse',
  },
  messageContent: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 12,
    paddingBottom: 8,
  },
  ownMessageContent: {
    borderBottomRightRadius: 4,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    marginHorizontal: 16,
  },
});

export default GroupChatScreen; 