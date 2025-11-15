import connectDB from "../../../db/connect";
import Chat from "../../../models/Chat";
import { TTL_SECONDS } from '../../../lib/constants';
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        const { action, chatID, password } = await req.json().catch(() => ({}));

        // Validate inputs
        if (!chatID || typeof chatID !== 'string') {
            return NextResponse.json({ 
                success: false,
                error: "Valid chatID string is required" 
            }, { status: 400 });
        }

        if (!action || !['makePermanent', 'makeTemporary'].includes(action)) {
            return NextResponse.json({ 
                success: false,
                error: "Valid action is required" 
            }, { status: 400 });
        }

        // Verify admin password against server-side env variable
        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ 
                success: false,
                error: "Invalid admin password" 
            }, { status: 401 });
        }

        // Sanitize chatID
        const sanitizedChatID = chatID
            .replace(/[^a-zA-Z0-9-]/g, '')
            .slice(0, 100);

        const isPermanent = action === 'makePermanent';
        const chat = await Chat.findOne({ chatID: sanitizedChatID });

        if (!chat) {
            return NextResponse.json({ 
                success: false,
                error: "Chat not found" 
            }, { status: 404 });
        }

        // Update chat permanence status only
        chat.isPermanent = isPermanent;
        await chat.save();

        return NextResponse.json({
            success: true,
            message: `Chat is now ${isPermanent ? 'permanent' : 'temporary'}`,
            data: {
                isPermanent: chat.isPermanent,
                updatedAt: chat.updatedAt,
                expiresAt: chat.isPermanent ? 
                    null : 
                    new Date(chat.updatedAt.getTime() + (TTL_SECONDS * 1000))
            }
        }, { status: 200 });

    } catch(err) {
        console.error("Error in admin route:", err);
        return NextResponse.json({ 
            success: false,
            error: "Internal server error while updating chat status"
        }, { status: 500 });
    }
} 