import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// Define the video schema
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // Cloudinary URL for the video file
      required: true
    },
    thumbnail: {
      type: String, // Cloudinary URL for the video thumbnail
      required: true
    },
    title: {
      type: String, // Title of the video
      required: true
    },
    description: {
      type: String, // Description of the video
      required: true
    },
    duration: {
      type: Number,//it needs to extract from cloudinaryURL
      required: true
    },
    views: {
      type: Number, // Number of views for the video
      default: 0
    },
    isPublished: {
      type: Boolean, // Indicates whether the video is published
      default: true
    },
    owner: {
      type: Schema.Types.ObjectId, // Reference to the owner user
      ref: "User" // Reference to the "User" model
    }
  },
  { timestamps: true } // Enable timestamps for createdAt and updatedAt
);

// Create the Video model
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema);
