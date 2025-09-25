import mongoose from 'mongoose';

const stickyNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  color: {
    type: String,
    default: '#ffd700', // Default yellow
    enum: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
  },
  position: {
    x: {
      type: Number,
      default: 100
    },
    y: {
      type: Number,
      default: 100
    }
  },
  size: {
    width: {
      type: Number,
      default: 200,
      min: 150,
      max: 400
    },
    height: {
      type: Number,
      default: 200,
      min: 150,
      max: 400
    }
  },
  zIndex: {
    type: Number,
    default: 1
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure user can't have too many sticky notes
stickyNoteSchema.index({ userId: 1 });

const StickyNote = mongoose.model('StickyNote', stickyNoteSchema);

export default StickyNote;
