import { prisma } from "../database/database.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // The ID of the friend/user we are chatting with
    const currentUserId = req.user.userId; // From authenticated token

    if (!userId) {
      return errorResponse(res, "User ID is required", 400);
    }

    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(currentUserId),
            receiverId: parseInt(userId)
          },
          {
            senderId: parseInt(userId),
            receiverId: parseInt(currentUserId)
          }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    return successResponse(res, messages, "Messages retrieved successfully");
  } catch (error) {
    console.error("Error fetching messages:", error);
    return errorResponse(res, "Failed to fetch messages", 500);
  }
};

export const getConversations = async (req, res) => {
    try {
      const currentUserId = req.user.userId;
  
      // Find all interactions
      const messages = await prisma.directMessage.findMany({
        where: {
          OR: [
            { senderId: currentUserId },
            { receiverId: currentUserId }
          ]
        },
        select: {
          senderId: true,
          receiverId: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
  
      // Extract unique user IDs that are NOT me
      const contactedUserIds = new Set();
      messages.forEach(msg => {
        if (msg.senderId !== currentUserId) contactedUserIds.add(msg.senderId);
        if (msg.receiverId !== currentUserId) contactedUserIds.add(msg.receiverId);
      });
  
      const uniqueIds = Array.from(contactedUserIds);
  
      if (uniqueIds.length === 0) {
          return successResponse(res, [], "No conversations found");
      }
  
      // Fetch details for these users
      const users = await prisma.user.findMany({
        where: {
          id: { in: uniqueIds }
        },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          status: true
        }
      });

      const rooms = users.map(u => ({
          id: u.id.toString(), 
          name: u.username,
          avatarUrl: u.avatarUrl,
          status: u.status,
          unread: 0 
      }));
  
      return successResponse(res, rooms, "Conversations retrieved");
    } catch (error) {
      console.error(error);
      return errorResponse(res, "Failed to fetch conversations", 500, error);
    }
};

export const deleteConversation = async (req, res) => {
    try {
      const { userId } = req.params; // The other user ID
      const currentUserId = req.user.userId;
  
      if (!userId) {
        return errorResponse(res, "Target user ID is required", 400);
      }
  
      // Delete all messages between current user and target user
      await prisma.directMessage.deleteMany({
        where: {
          OR: [
            {
              senderId: parseInt(currentUserId),
              receiverId: parseInt(userId)
            },
            {
              senderId: parseInt(userId),
              receiverId: parseInt(currentUserId)
            }
          ]
        }
      });
  
      return successResponse(res, null, "Conversation deleted successfully");
    } catch (error) {
      console.error(error);
      return errorResponse(res, "Failed to delete conversation", 500, error);
    }
};
