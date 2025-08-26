import mongoose = require("mongoose");
const { Schema, model } = mongoose;

// #region IConnectionRequest
export interface IConnectionRequest extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  fromUserId: mongoose.Schema.Types.ObjectId;
  toUserId: mongoose.Schema.Types.ObjectId;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// #region connectionRequestSchema
const connectionRequestSchema = new Schema<IConnectionRequest>(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: "Invalid fromUserId",
      },
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: "Invalid toUserId",
      },
    },
    status: {
      type: String,
      enum: ["ignored", "interested", "accepted", "rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("validate", function (next) {
  if (this.fromUserId.toString() === this.toUserId.toString()) {
    return next(new Error("You cannot send a request to yourself"));
  }
  next();
});

connectionRequestSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  const existing = await mongoose.model("ConnectionRequest").findOne({
    $or: [
      { fromUserId: this.fromUserId, toUserId: this.toUserId },
      { fromUserId: this.toUserId, toUserId: this.fromUserId },
    ],
  });

  if (existing) {
    return next(
      new Error("Connection request already exists between these users")
    );
  }

  next();
});

const ConnectionRequest = model<IConnectionRequest>(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
