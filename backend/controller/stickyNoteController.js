import StickyNote from '../models/StickyNote.js';

// Get all sticky notes for a user
export const getUserStickyNotes = async (req, res) => {
  try {
    const userId = req.user?._id;
    // If not authenticated, return 401 so client can redirect to login
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const stickyNotes = await StickyNote.find({
      userId,
      isVisible: true
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: stickyNotes
    });
  } catch (error) {
    console.error('Error fetching sticky notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sticky notes'
    });
  }
};

// Create a new sticky note
export const createStickyNote = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    const { content, color, position, size } = req.body;

    // Check if user has reached the limit (max 10 sticky notes)
    const existingCount = await StickyNote.countDocuments({ 
      userId, 
      isVisible: true 
    });
    
    if (existingCount >= 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 sticky notes allowed per user'
      });
    }

    // Get the highest zIndex for this user and increment
    const highestZNote = await StickyNote.findOne({ userId })
      .sort({ zIndex: -1 });
    const newZIndex = highestZNote ? highestZNote.zIndex + 1 : 1;

    const stickyNote = new StickyNote({
      userId,
      content: content || 'New note...',
      color: color || '#ffd700',
      position: position || { x: 100, y: 100 },
      size: size || { width: 200, height: 200 },
      zIndex: newZIndex
    });

    await stickyNote.save();

    res.status(201).json({
      success: true,
      data: stickyNote
    });
  } catch (error) {
    console.error('Error creating sticky note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sticky note'
    });
  }
};

// Update a sticky note
export const updateStickyNote = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    const { id } = req.params;
    const updates = req.body;

    const stickyNote = await StickyNote.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!stickyNote) {
      return res.status(404).json({
        success: false,
        message: 'Sticky note not found'
      });
    }

    res.json({
      success: true,
      data: stickyNote
    });
  } catch (error) {
    console.error('Error updating sticky note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sticky note'
    });
  }
};

// Delete a sticky note
export const deleteStickyNote = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    const { id } = req.params;

    const stickyNote = await StickyNote.findOneAndUpdate(
      { _id: id, userId },
      { isVisible: false },
      { new: true }
    );

    if (!stickyNote) {
      return res.status(404).json({
        success: false,
        message: 'Sticky note not found'
      });
    }

    res.json({
      success: true,
      message: 'Sticky note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sticky note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sticky note'
    });
  }
};

// Bring a sticky note to front (update zIndex)
export const bringToFront = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    const { id } = req.params;

    // Get the highest zIndex for this user
    const highestZNote = await StickyNote.findOne({ userId })
      .sort({ zIndex: -1 });
    const newZIndex = highestZNote ? highestZNote.zIndex + 1 : 1;

    const stickyNote = await StickyNote.findOneAndUpdate(
      { _id: id, userId },
      { zIndex: newZIndex },
      { new: true }
    );

    if (!stickyNote) {
      return res.status(404).json({
        success: false,
        message: 'Sticky note not found'
      });
    }

    res.json({
      success: true,
      data: stickyNote
    });
  } catch (error) {
    console.error('Error bringing sticky note to front:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sticky note'
    });
  }
};
