import { Router, Response, Request } from 'express';
import { Chat } from '../models/Chat';
import { Notification } from '../models/Notification';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get or create chat
router.post('/start/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const participants = [req.user?.id, req.params.userId].sort();

    let chat = await Chat.findOne({
      participants: { $all: participants }
    });

    if (!chat) {
      chat = new Chat({ participants });
      await chat.save();
    }

    res.json(chat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's chats
router.get('/list', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const chats = await Chat.find({
      participants: req.user?.id,
      isActive: true
    })
    .populate('participants', 'name profileImages')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat messages
router.get('/:chatId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user?.id
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/:chatId/message', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { content, mediaUrl, mediaType } = req.body;

    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.chatId,
        participants: req.user?.id
      },
      {
        $push: {
          messages: {
            senderId: req.user?.id,
            content,
            mediaUrl,
            mediaType: mediaType || 'text',
            createdAt: new Date()
          }
        },
        lastMessage: {
          content,
          sentAt: new Date(),
          senderId: req.user?.id
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Create notification for other participant
    const otherParticipant = chat.participants.find((p: any) => p.toString() !== req.user?.id);
    if (otherParticipant) {
      const notification = new Notification({
        userId: otherParticipant,
        type: 'message',
        relatedChatId: chat._id,
        relatedUserId: req.user?.id,
        title: 'New message',
        body: content
      });
      await notification.save();
    }

    res.json(chat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
