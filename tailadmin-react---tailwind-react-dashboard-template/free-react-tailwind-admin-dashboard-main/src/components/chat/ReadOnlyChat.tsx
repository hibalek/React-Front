interface Message {
    id: number;
    sender: {
      name: string;
      image: string;
    };
    content: string;
    timestamp: string;
  }
  
  interface ReadOnlyChatProps {
    messages: Message[];
  }
  
  export default function ReadOnlyChat({ messages }: ReadOnlyChatProps) {
    return (
      <div className="h-[500px] overflow-y-auto bg-white border rounded-lg p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 items-start">
            <img src={msg.sender.image} alt={msg.sender.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-semibold text-gray-800">{msg.sender.name}</div>
              <div className="text-sm text-gray-700">{msg.content}</div>
              <div className="text-xs text-gray-400">{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  