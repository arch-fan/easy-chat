import { WebSocket } from "ws";

export class Client {
  constructor(
    public readonly ws: WebSocket,
    public readonly username: string
  ) {}
}
