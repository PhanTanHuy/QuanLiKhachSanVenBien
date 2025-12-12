import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class pathRecep {
    getRoomListPage = (req, res) => {
        const adminPath = path.resolve(__dirname, '../../../frontend/pages/receptionist/roomList.html');
        res.sendFile(adminPath);
    };

    getBookingPage = (req, res) => {
        const adminPath = path.resolve(__dirname, '../../../frontend/pages/receptionist/bookingManagement.html');
        res.sendFile(adminPath);
    };

    getProfilePage = (req, res) => {
        const adminPath = path.resolve(__dirname, '../../../frontend/pages/receptionist/profileRecep.html');
        res.sendFile(adminPath);
    };
    
}

export default new pathRecep();