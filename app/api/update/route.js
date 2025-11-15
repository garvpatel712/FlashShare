import connectDB from "../../../db/connect";
import Chat from "../../../models/Chat";
import { TTL_SECONDS } from '../../../lib/constants';
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Connect to database
        await connectDB();

        // Parse and validate request data
        const data = await req.json().catch(() => ({}));
        const { chatID, chatHistory } = data;

        // Input validation
        if (!chatID || typeof chatID !== 'string') {
            return NextResponse.json({ 
                success: false,
                error: "Valid chatID string is required" 
            }, { status: 400 });
        }

        if (!Array.isArray(chatHistory)) {
            return NextResponse.json({ 
                success: false,
                error: "chatHistory must be an array" 
            }, { status: 400 });
        }

        // Sanitize chatID
        const sanitizedChatID = chatID
            .replace(/[^a-zA-Z0-9-]/g, '')
            .slice(0, 100);

        // Validate chat history structure
        const validatedHistory = chatHistory.map(item => ({
            message: typeof item.message === 'string' ? item.message.slice(0, 50000) : '',
            uploads: Array.isArray(item.uploads) ? item.uploads.map(upload => ({
                id: String(upload.id || ''),
                type: String(upload.type || ''),
                name: String(upload.name || '').slice(0, 255),
                url: String(upload.url || ''),
                uuid: String(upload.uuid || '')
            })) : []
        }));

        // Update chat with validated data
        const chat = await Chat.findOneAndUpdate(
            { chatID: sanitizedChatID },
            { chatHistory: validatedHistory },
            { 
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        if (!chat) {
            return NextResponse.json({ 
                success: false,
                error: "Failed to update chat" 
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: {
                chatHistory: chat.chatHistory,
                chat: {
                    isPermanent: chat.isPermanent,
                    updatedAt: chat.updatedAt,
                    expiresAt: chat.isPermanent ? 
                        null : 
                        new Date(chat.updatedAt.getTime() + (TTL_SECONDS * 1000))
                }
            }
        }, { status: 200 });

    } catch(err) {
        console.error("Error in update route:", err);
        return NextResponse.json({ 
            success: false,
            error: "Internal server error while updating chat"
        }, { status: 500 });
    }
}
