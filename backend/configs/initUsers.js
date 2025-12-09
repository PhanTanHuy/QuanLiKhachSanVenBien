import User from '../models/User.js';
import { accounts } from '../mock/mock_account.js';
import bcrypt from 'bcryptjs';

export default async function initUsers() {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            // Hash password cho tất cả account mẫu
            const hashedAccounts = await Promise.all(
                accounts.map(async (account) => ({
                    ...account,
                    hashedPassword: await bcrypt.hash(account.password, 10),
                    password: undefined // Xóa password plain text
                }))
            );

            // Xóa field password sau khi hash
            const finalAccounts = hashedAccounts.map(({ password, ...rest }) => rest);

            await User.insertMany(finalAccounts);
            console.log("Đã khởi tạo dữ liệu user mẫu!");
        }
    } catch (error) {
        console.error("Lỗi khi khởi tạo user:", error);
    }
}
