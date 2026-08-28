import express from 'express';

// Shared SSE client store — imported by both chat.ts and discordClient.ts
export const chatClients = new Map<string, express.Response[]>();

export const broadcastToTicket = (ticketId: string, data: any) => {
  const clients = chatClients.get(ticketId);
  if (clients && clients.length > 0) {
    clients.forEach(res => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
};
