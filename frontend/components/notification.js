class NotificationManager {
    constructor() {
        // Notification popup
        this.el = document.createElement("div");
        this.el.id = "globalNotification";
        this.el.className = "notification";
        document.body.appendChild(this.el);
        this.timeout = null;

        // Confirm popup
        this.confirmEl = document.createElement("div");
        this.confirmEl.id = "globalConfirm";
        this.confirmEl.className = "confirm-popup";
        this.confirmEl.innerHTML = `
            <div class="confirm-content">
                <p class="confirm-message"></p>
                <div class="confirm-buttons">
                    <button class="confirm-yes">Đồng ý</button>
                    <button class="confirm-no">Hủy</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.confirmEl);

        // Styles
        const style = document.createElement("style");
        style.textContent = `
            /* Notification */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                color: white;
                font-weight: bold;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
                transform: translateY(-20px);
                display: none;
            }
            .notification.show { display: block; opacity: 1; transform: translateY(0); }
            .notification.success { background-color: #4caf50; }
            .notification.error { background-color: #f44336; }

            /* Confirm */
            .confirm-popup {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            .confirm-popup.show { display: flex; }
            .confirm-content {
                background: white;
                padding: 20px 30px;
                border-radius: 10px;
                text-align: center;
                min-width: 300px;
            }
            .confirm-buttons {
                margin-top: 15px;
                display: flex;
                justify-content: space-around;
            }
            .confirm-buttons button {
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            }
            .confirm-yes { background-color: #4caf50; color: white; }
            .confirm-no { background-color: #f44336; color: white; }
        `;
        document.head.appendChild(style);
    }

    // Hiển thị notification
    show(message, type = "success", duration = 5000) {
        clearTimeout(this.timeout);
        this.el.textContent = message;
        this.el.className = `notification show ${type}`;
        this.timeout = setTimeout(() => this.el.classList.remove("show"), duration);
    }

    // Hiển thị confirm, trả về Promise<boolean>
    confirm(message) {
        return new Promise(resolve => {
            const msgEl = this.confirmEl.querySelector(".confirm-message");
            msgEl.textContent = message;

            this.confirmEl.classList.add("show");

            const yesBtn = this.confirmEl.querySelector(".confirm-yes");
            const noBtn = this.confirmEl.querySelector(".confirm-no");

            const cleanup = () => {
                this.confirmEl.classList.remove("show");
                yesBtn.removeEventListener("click", onYes);
                noBtn.removeEventListener("click", onNo);
            };

            const onYes = () => { cleanup(); resolve(true); };
            const onNo = () => { cleanup(); resolve(false); };

            yesBtn.addEventListener("click", onYes);
            noBtn.addEventListener("click", onNo);
        });
    }
}

export const Notify = new NotificationManager();
