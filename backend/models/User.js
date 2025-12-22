import mongoose from "mongoose";
import { UserRole } from "../configs/enum/userEnum.js";

const userSchema = new mongoose.Schema(
  {
    hashedPassword: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String },
    cccd: { type: String, unique: true, sparse: true },
    address: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    avatar: {
      type: String,
      default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXU1NT////R0dHV1dX09PTf39/8/Pzb29vu7u7x8fHl5eX5+fnc3Nzr6+vi4uLw8PCR9fa8AAAFQElEQVR4nO2d6ZKjMAyEjQzmSsj7v+2gMBnIHcCy2hl9Vbs/9qiaLtmSfDXOGYZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhbIOI/n59D97z76MmXw/dsS2Z9tgNtf/VOf2DvCFXd20fimtC33a1yzyYU3Sq5lbcQmZTLf5ljlDd9E/lTfRNnXEgq/KNvImy0v5Bt0HVu/AtAlllF0dPh7J4Pv9uCUVZU1aTkVzzsboLTU6Jdc0AncloqNKxWDFCL4z/45iHRPKfZdBHlD4DjVSvD98ikPDF0VO1Qx9ToefUvQJHidoSXkJV2DNGmRCgU+r+CIJHsY4isChqbSHP8Fvq/CN61GSzvQ7eUmpLeQh3MtEA7G58pCxzoQJc9++uE0tC0JZzB61fLr2mQRunh8gCi+KgLekaKmOOUSaUWEGMm2YmoFobilcKZ5CCuHvJ9BigIIqEECiIPlrHfUuNUvaj18ILODUxajszg9PYyOQZBiTX0ElM4QlkmMqMUQZkmEplUgZjP6MTjGGnLY6hVkxgUbQIE5Fi7T89okdQ6AUFFoV+U+MF1r5LDgCNWyeqECDVRN1EvAdgW1Gs7Z4AaL4FezYGoG8TWv1eAFgFm0JTaAoBFEo23hCt9z+oh8Jdm75CN4gqHLTlCW4HTyBsCn/7+pDX+IL7NBBrfMlyEQCKheMlsFQQA8IC2P2H/VISnIcQg/Q/nFt8/dmT3NEMyMGM84JnwAgFn5E7x0fh2+9iOKlcA5NnnND5E0RP+kcVvXMLUCEUmYlIs3CEBO6XYin8B3eEKXJjEwBflMa+q4/Ht7+3YNa83n5FAH0zM7an0d494TSk11C0t2uYYzTGE9kJ5IeyUSRCvyHdLTGgC9z9EjgEtGbtDu/2vsfHnYN/7PJU0P7hP2NzdwPaydzjN3ubZBJCx+4fG/xpcnD9WMAeQ2so4XPoPcQ+WJ/k1cBeWPnp4+N3+tjri7K1bKP6+Nav7QjbZ3+Cd+QOp9eee5Rr+H7hwUrsm3gfvLarKd/heQP7XLL3ZdMyJ/a+/DKPzylSZ+dSOjuYum+JnWEYhmEYf0xlnr27L8x/lj+jDH/omrbvF9uMIfR923QH7zJXSZNZ+au109m2PFeV5IZ2Ctuz5dPv37YD4IHvS85dth/WbNSUg8+rG6f6hdX8k3hm5M1ONGw7Ku2HPGbktu3gX434e27TdvfWs5mAr5Hq/be/SuT5GOnCCeYBjeePBUS7i3EgD1c5KPqNIbRAstd8vJtt4ew/jxTFcYRGv0GLdRhF8V93haIDOjAV8jfByal0EnmfF2CePVEr9AAxYNz19qKmCi3CXBwjKPYAMRStsjovbalwvtGuGsZRoNwLUiYoX9pnywhphYrGEV72kfNMrbaBQ07SUHCmV+vChc13ZrTKorBvyxKlqbjrquw6gsbzBNle5pZSo7dJN0aZ9AYZ3qcbo0xI/lVd8W7tluStTZpavyRxshF2aXtEYjOe9CFMHMT4n5V5T9oPz9TCK4qHClMGUdh39hkpN6bSR5AJ6Upi2nZmJlljk7QjXZIs12jkGSZZrqGjmsJE+/yiH0N4TSLLGo1+5kKaYaqVSZkk2VQtkzJpsqlOmplI4lGnOQ3TTEQ5u9L3JDE0Tb59cU2CzQzVRJMm1ejVe6aXF+gVpyFPRPkVlOzHj94j/5lgWZP594jb0At//Og90ssLOb/ZTxH3pVXahJoR345SLofyBTHtqeFjhdKjVF+hrEBTaApzUJj+4PAa8WNEgIovrNCpd23SAhNehHrM6utRP3IESPnqlEjaAAAAAElFTkSuQmCC",
    },
    // --- reset password ---
    resetPasswordToken: { type: String, index: true, sparse: true },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
