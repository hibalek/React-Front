import { useParams } from "react-router-dom";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { FaPhoneAlt, FaVideo, FaPaperclip, FaMicrophone } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import PageMeta from "../../components/common/PageMeta";

interface UserProfile {
  name: string;
  role: string;
  time: string;
  online: boolean;
  img: string;
}

interface Message {
  sender: "me" | "them";
  content: string;
  image?: string;
  time: string;
}

const fakeUsers: UserProfile[] = [
  { name: "Amina Lahlou", role: "Diététicienne", time: "10 mins", online: true, img: "https://i.pravatar.cc/40?img=4" },
  { name: "Nadir Boukhelifa", role: "Coach Sportif", time: "25 mins", online: true, img: "https://i.pravatar.cc/40?img=5" },
  { name: "Sara Mebarki", role: "Psychologue", time: "50 mins", online: false, img: "https://i.pravatar.cc/40?img=6" },
];

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [selectedUser, setSelectedUser] = useState<UserProfile>(fakeUsers[0]);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMessages = conversations[selectedUser.name] || [];

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      sender: "me",
      content: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) => {
      const updated = [...(prev[selectedUser.name] || []), newMessage];
      return { ...prev, [selectedUser.name]: updated };
    });

    setInput("");
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newMessage: Message = {
        sender: "me",
        content: "Image envoyée",
        image: imageUrl,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) => {
        const updated = [...(prev[selectedUser.name] || []), newMessage];
        return { ...prev, [selectedUser.name]: updated };
      });
    }
  };

  const handleVoiceMessage = () => {
    const newMessage: Message = {
      sender: "me",
      content: "Message vocal (simulé)",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) => {
      const updated = [...(prev[selectedUser.name] || []), newMessage];
      return { ...prev, [selectedUser.name]: updated };
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 text-black dark:bg-[#0f172a] dark:text-white">
       <PageMeta
        title="ObeseTech | Messagerie"
        description="Discuter avec patient ou medecin"
      />
      {/* Sidebar */}
      <aside className="w-1/4 bg-white p-6 shadow-md flex flex-col rounded-r-3xl dark:bg-[#1e293b]">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Conversations</h2>
        <input
          type="text"
          placeholder="Recherche..."
          className="bg-gray-100 px-4 py-2 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-6 dark:bg-[#334155] dark:placeholder:text-gray-300"
        />
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {fakeUsers.map((user, index) => (
            <div
              key={index}
              onClick={() => setSelectedUser(user)}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-200 transition cursor-pointer dark:hover:bg-[#334155]"
            >
              <div className="relative">
                <img src={user.img} alt={user.name} className="w-12 h-12 rounded-full" />
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{user.time}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow border-b dark:bg-[#1e293b] dark:border-[#334155]">
          <div className="flex items-center gap-4">
            <img src={selectedUser.img} alt={selectedUser.name} className="w-12 h-12 rounded-full" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{selectedUser.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.role}</p>
            </div>
          </div>
          <div className="flex gap-4 text-2xl text-blue-500">
            <FaPhoneAlt className="cursor-pointer hover:text-blue-700" />
            <FaVideo className="cursor-pointer hover:text-blue-700" />
          </div>
        </header>

        {/* Messages */}
        <section className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50 space-y-5 dark:bg-[#0f172a]">
          {currentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-3xl shadow-sm max-w-sm ${
                msg.sender === "me"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-white text-gray-900 dark:bg-[#1e293b] dark:text-white"
              }`}
            >
              {msg.image && <img src={msg.image} alt="sent" className="mb-2 rounded-xl max-h-60" />}
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs block mt-2 text-right opacity-70">{msg.time}</span>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="flex items-center gap-4 px-6 py-4 bg-white shadow border-t dark:bg-[#1e293b] dark:border-[#334155]">
          <FaPaperclip
            className="text-gray-500 hover:text-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-blue-400"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
          <FaMicrophone
            className="text-gray-500 hover:text-blue-500 cursor-pointer dark:text-gray-400 dark:hover:text-blue-400"
            onClick={handleVoiceMessage}
          />
          <form onSubmit={handleSendMessage} className="flex items-center flex-1 gap-3">
            <input
              type="text"
              placeholder="Écrire un message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-100 px-5 py-3 rounded-full text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#334155] dark:text-white"
            />
            <button type="submit" className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-700 transition">
              <FiSend />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}
