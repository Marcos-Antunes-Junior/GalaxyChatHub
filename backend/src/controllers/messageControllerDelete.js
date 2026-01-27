export const deleteConversation = async (req, res) => {
    try {
      const { userId } = req.params;
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
