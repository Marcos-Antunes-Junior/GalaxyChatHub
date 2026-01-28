
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
          id: u.id.toString(), // Client expects string ID for rooms
          name: u.username,
          avatarUrl: u.avatarUrl,
          status: u.status,
          unread: 0 // Calculate unread
      }));
  
      return successResponse(res, rooms, "Conversations retrieved");
    } catch (error) {
      console.error(error);
      return errorResponse(res, "Failed to fetch conversations", 500, error);
    }
  };
