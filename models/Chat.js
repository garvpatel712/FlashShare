import mongoose from 'mongoose';
import { TTL_SECONDS } from '../lib/constants';

const uploadSchema = new mongoose.Schema({
  id: String,
  type: String,
  name: String,
  url: String,
  uuid: String
});

const chatHistorySchema = new mongoose.Schema({
  message: String,
  uploads: [uploadSchema]
});

const chatSchema = new mongoose.Schema({
  chatID: {
    type: String,
    required: true,
    unique: true,
  },
  chatHistory: [chatHistorySchema],
  isPermanent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create TTL index
chatSchema.index(
  { updatedAt: 1 }, 
  { 
    expireAfterSeconds: TTL_SECONDS,
    partialFilterExpression: { isPermanent: false },
    background: true
  }
);

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

// Function to update TTL value using collMod
const updateTTL = async () => {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connection.asPromise();
    }

    const result = await mongoose.connection.db.command({
      collMod: 'chats',
      index: {
        keyPattern: { updatedAt: 1 },
        expireAfterSeconds: TTL_SECONDS
      }
    });
    
    console.log('TTL index updated:', result);
  } catch (error) {
    console.error('Error updating TTL:', error);
  }
};

mongoose.connection.on('connected', () => {
  updateTTL().catch(console.error);
});

export default Chat; 