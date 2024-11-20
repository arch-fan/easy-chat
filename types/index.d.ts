export namespace AppWS {
  interface WSMessage<T extends string> {
    type: T;
  }
  interface MessageReceive extends WSMessage<"messageReceive"> {
    username: string;
    text: string;
  }

  interface MessageSend extends WSMessage<"messageSend"> {
    text: string;
  }
}
