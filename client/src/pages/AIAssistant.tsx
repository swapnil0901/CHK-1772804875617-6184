import { useState, useRef, useEffect } from "react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Card, Button } from "@/components/ui-kit";
import { useAIChat } from "@/hooks/use-poultry";
import { Bot, Send, User } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAssistant() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hello! I am your AI Farm Assistant. I can help analyze your data or answer questions about poultry management. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const { mutateAsync: sendMessage, isPending } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const res = await sendMessage(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: res.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't connect to the server. Please try again later." }]);
    }
  };

  return (
    <AppLayout>
      <PageHeader 
        title="AI Assistant" 
        description="Get smart insights and advice on farm management."
      />

      <Card className="max-w-4xl mx-auto h-[600px] flex flex-col p-0 overflow-hidden border-border/50">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-background/50">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-md ${msg.role === 'ai' ? 'bg-primary text-white' : 'bg-white text-primary border border-primary/20'}`}>
                {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`p-4 rounded-2xl text-[15px] leading-relaxed ${
                msg.role === 'ai' 
                  ? 'bg-white border border-border/50 shadow-sm text-foreground' 
                  : 'bg-primary text-white shadow-lg shadow-primary/20'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isPending && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-border/50 shadow-sm text-foreground flex gap-1">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-white border-t border-border/50">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about egg yields, chicken health, or expenses..."
              className="flex-1 bg-background border-2 border-border/50 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:border-primary transition-colors text-base"
              disabled={isPending}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isPending}
              className="absolute right-2 top-2 bottom-2 w-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </div>
      </Card>
    </AppLayout>
  );
}
