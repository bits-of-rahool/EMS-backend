import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    designation: {
      type: String,
      enum: ["HR", "Sales","Manager"],
      required: true,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    course: {
      type: String,
      enum: ["MCA", "BCA", "BSC"],
      required: true,
    },
    image: {
      type: String,
    },
    workUnder:{
        type: Schema.Types.ObjectId,
        ref:"Admin"
    }
  },
  {
    timestamps: true,
  }
);

employeeSchema.plugin(mongooseAggregatePaginate);
export const Employee = mongoose.model("Employee", employeeSchema);
