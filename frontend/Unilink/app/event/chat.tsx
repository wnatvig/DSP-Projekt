import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/expo";
import { socket, API_URL } from "../../lib/socket";
import {fetchUser} from "../../lib/fetchUser"
import {User} from "../(home)/profile"

type ChatParams = {
  eventId?: string;
  title?: string;
};

type Message = {
  messageId: string;
  eventId: string;
  userId: string;
  username: string;
  textString: string;
  timeSent: string;
};

export default function Chat() {
  const router = useRouter();
  const { eventId, title } = useLocalSearchParams<ChatParams>();
  const { userId, isLoaded, isSignedIn } = useAuth();

  const flatListRef = useRef<FlatList<Message>>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState("");

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    async function loadUserName() {
      try {
        const userData = await fetchUser(userId!);
  
        setUserName(userData!.username);
  
      } catch (err) {
        console.log("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserName();

    async function loadOldMessages() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/events/${eventId}/messages`);
        const data: Message[] = await res.json();

        setMessages(data);
      } catch (error) {
        console.log("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOldMessages();

    socket.connect();
    socket.emit("joinRoom", eventId);

    socket.on("receiveMessage", (newMessage: Message) => {
      console.log("received message");
      if (true) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.emit("leaveRoom", eventId);
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [eventId]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  function sendMessage() {
    if (!message.trim() || !eventId) return;

    socket.emit("sendMessage", {
      roomId: eventId,
      userId: userId,
      username: username,
      textString: message.trim(),
      timeSent: Date.now(),
    });
    console.log("Sent message");
    setMessage("");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <View>
          <Text style={styles.headerTitle}>{title || "Event Chat"}</Text>
          <Text style={styles.headerSubtitle}>Live event chat</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.messageId}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => {
          const isMine = item.userId === userId;

          return (
            <View
              style={[
                styles.messageBubble,
                isMine ? styles.myMessage : styles.otherMessage,
              ]}
            >
              {!isMine && <Text style={styles.username}>{item.username}</Text>}

              <Text
                style={[styles.messageText, isMine && styles.myMessageText]}
              >
                {item.textString}
              </Text>

              <Text style={[styles.timeText, isMine && styles.myTimeText]}>
                {new Date(item.timeSent).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Write a message..."
          multiline
          style={styles.input}
        />

        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 24,
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#777",
  },

  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },

  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: "78%",
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#111",
    borderBottomRightRadius: 4,
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },

  username: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    color: "#555",
  },

  messageText: {
    fontSize: 15,
    color: "#111",
    lineHeight: 20,
  },

  myMessageText: {
    color: "#fff",
  },

  timeText: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
    color: "#777",
  },

  myTimeText: {
    color: "#ccc",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 50
  },

  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#F9F9F9",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },

  sendButton: {
    backgroundColor: "#111",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
  },

  sendText: {
    color: "#fff",
    fontWeight: "700",
  },
});
