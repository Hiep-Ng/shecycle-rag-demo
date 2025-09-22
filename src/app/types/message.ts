export type BaseMessage = {
  id: string;
  sender: "user" | "bot";
  timestamp: number;
};

export type TextMessage = BaseMessage & {
  type: "text";
  content: string;
};

export type ActionMessage = BaseMessage & {
  type: "action";
  action: "openCamera";
  label: string;
};

// Add typing message
export type TypingMessage = BaseMessage & {
  type: "typing";
};

export type Message = TextMessage | ActionMessage | TypingMessage;
