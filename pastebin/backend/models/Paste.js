import mongoose from 'mongoose';

const pasteSchema = new mongoose.Schema({
  _id: { type: String },
  content: { type: String, required: true },
  ttl_seconds: { type: Number, default: null },
  max_views: { type: Number, default: null },
  remaining_views: { type: Number, default: null },
  expires_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
});

pasteSchema.pre('save', function () {
  if (this.max_views !== null && this.remaining_views === null) {
    this.remaining_views = this.max_views;
  }

  if (this.ttl_seconds !== null && this.expires_at === null) {
    this.expires_at = new Date(
      this.created_at.getTime() + this.ttl_seconds * 1000
    );
  }
});
export default mongoose.model('Paste', pasteSchema);
