import connectDB from '../../../db/connect';
import Chat from '../../../models/Chat';
import { TTL_SECONDS } from '../../../lib/constants';
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        const { chatID } = await req.json().catch(() => ({}));

        if (!chatID || typeof chatID !== 'string') {
            return NextResponse.json({ 
                success: false,
                error: "Valid chatID required" 
            }, { status: 400 });
        }

        const sanitizedChatID = chatID
            .replace(/[^a-zA-Z0-9-]/g, '')
            .slice(0, 100);

        let chat = await Chat.findOne({ chatID: sanitizedChatID });

        if (!chat) {
            chat = await Chat.create({ 
                chatID: sanitizedChatID,
                chatHistory: [],
                isPermanent: false
            });
            console.log('New chat created:', chat);
        }

        const expiresAt = chat.isPermanent ? 
            null : 
            new Date(Date.now() + (TTL_SECONDS * 1000));
        
        return NextResponse.json({ 
            success: true,
            data: {
                chatHistory: chat.chatHistory || [],
                chat: {
                    isPermanent: chat.isPermanent,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                    expiresAt: expiresAt
                }
            }
        });

    } catch(err) {
        console.error("Error in fetch route:", err);
        return NextResponse.json({ 
            success: false,
            error: "Server error" 
        }, { status: 500 });
    }
}