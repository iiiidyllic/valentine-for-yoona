/* ============================= */
/* 版本检查 */
/* ============================= */
(async function checkForUpdates() {
    const currentVersion = "1.0";
    const versionUrl = "https://raw.githubusercontent.com/ivysone/Will-you-be-my-Valentine-/main/version.json";

    try {
        const response = await fetch(versionUrl);
        if (!response.ok) return;
        const data = await response.json();
        if (currentVersion !== data.version) {
            alert(data.updateMessage);
        }
    } catch (error) {
        console.warn("Version check failed.");
    }
})();


/* ============================= */
/* Ask 页面逻辑 */
/* ============================= */

const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pookie please...",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "I will be very very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');

    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;

    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    const page1 = document.getElementById("page1");
    const page2 = document.getElementById("page2");

    page1.classList.remove("active");
    page2.classList.add("active");
}

function goToPaper() {
    const page2 = document.getElementById("page2");
    const page3 = document.getElementById("page3");

    page2.classList.remove("active");
    page3.classList.add("active");
}


/* ============================= */
/* Paper 拖拽旋转逻辑 */
/* ============================= */

let highestZ = 1;

class Paper {
    holdingPaper = false;
    mouseTouchX = 0;
    mouseTouchY = 0;
    mouseX = 0;
    mouseY = 0;
    prevMouseX = 0;
    prevMouseY = 0;
    velX = 0;
    velY = 0;
    rotation = Math.random() * 30 - 15;
    currentPaperX = 0;
    currentPaperY = 0;
    rotating = false;

    init(paper) {

        document.addEventListener('mousemove', (e) => {

            if (!this.rotating) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.velX = this.mouseX - this.prevMouseX;
                this.velY = this.mouseY - this.prevMouseY;
            }

            const dirX = e.clientX - this.mouseTouchX;
            const dirY = e.clientY - this.mouseTouchY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;
            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;

            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {

                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }

                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                paper.style.transform =
                    `translateX(${this.currentPaperX}px)
                     translateY(${this.currentPaperY}px)
                     rotateZ(${this.rotation}deg)`;
            }
        });

        paper.addEventListener('mousedown', (e) => {
            if (this.holdingPaper) return;

            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;

            if (e.button === 0) {
                this.mouseTouchX = this.mouseX;
                this.mouseTouchY = this.mouseY;
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }

            if (e.button === 2) {
                this.rotating = true;
            }
        });

        window.addEventListener('mouseup', () => {
            this.holdingPaper = false;
            this.rotating = false;
        });

        // 禁止右键菜单
        paper.addEventListener('contextmenu', (e) => e.preventDefault());
    }
}


/* ============================= */
/* 初始化 Paper */
/* ============================= */

window.addEventListener("DOMContentLoaded", () => {
    const papers = Array.from(document.querySelectorAll('.paper'));
    papers.forEach(paper => {
        const p = new Paper();
        p.init(paper);
    });
});
