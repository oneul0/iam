document.addEventListener('DOMContentLoaded', () => {
    initChatSystem();
});

function initChatSystem() {
    const chatInput = document.getElementById('chatInput');
    const btnSend = document.getElementById('btnSend');

    if (!chatInput || !btnSend) return;

    const kihoonAnswers = [
        { text: '소심한 저에게 먼저 말을 걸어주셔서 고마워요 😆 앞으로 친하게 지내요!' },
        { text: '반가워요!! 안 그래도 스터디원 구하고 있었는데, 내일 같이 이야기해 볼까요? ☕' },
        { text: '디엠 주셔서 감사합니다! 먼저 다가와 주셔서 정말 감동이에요... 내일 반갑게 인사해요! 🚀' }
    ];

    const qaDatabase = [
        {
            keywords: ['자기소개', '누구', '소개'],
            text: '안녕하세요! 백엔드 개발자를 꿈꾸는 김기훈입니다. 주로 Java와 Spring Boot를 사용한 프로젝트를 해왔어요! 💻'
        },
        {
            keywords: ['나이', '몇살', '학번'],
            text: '저는 99년생, 28살입니다!'
        },
        {
            keywords: ['음식', '최애', '빵', '고기'],
            text: '빵과 고기💯',
            image: '/static/bakery1_1.jpg'
        }
    ];

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessageBubble({ text }, 'me');
        chatInput.value = '';
        scrollChatToBottom();

        const foundItems = getSavedItems();
        const isAllCleared = foundItems.includes('item_coffee') && foundItems.includes('item_dumbbell');

        setTimeout(() => {
            let selectedReply;

            if (isAllCleared && (text.includes('오운완') || text.includes('아메리카노'))) {
                selectedReply = { text: '헉! 숨겨진 아이템을 다 찾고 암호까지 보내주셨군요. 🏋️‍♂️☕ 기훈 야호' };
            } else {
                selectedReply = qaDatabase.find((item) =>
                    item.keywords.some((keyword) => text.includes(keyword))
                );
            }

            if (!selectedReply) {
                selectedReply = kihoonAnswers[Math.floor(Math.random() * kihoonAnswers.length)];
            }

            appendMessageBubble(selectedReply, 'opponent');
            scrollChatToBottom();
        }, 1200);
    }

    btnSend.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') handleSendMessage();
    });
}

function getSavedItems() {
    try {
        const savedItems = JSON.parse(localStorage.getItem('found_items') || '[]');
        return Array.isArray(savedItems) ? savedItems : [];
    } catch {
        return [];
    }
}

function appendMessageBubble(message, senderType) {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    const wrapper = document.createElement('div');
    wrapper.classList.add('msg-wrapper', senderType);

    const bubble = document.createElement('div');
    bubble.classList.add('msg-bubble');

    if (message.image) {
        const image = document.createElement('img');
        image.src = message.image;
        image.alt = 'DM 첨부 이미지';
        image.style.width = '100%';
        image.style.borderRadius = '12px';
        image.style.marginBottom = '8px';
        image.style.display = 'block';
        bubble.appendChild(image);
    }

    if (message.text) {
        const text = document.createElement('span');
        text.textContent = message.text;
        bubble.appendChild(text);
    }

    wrapper.appendChild(bubble);
    chatBody.appendChild(wrapper);
}

function scrollChatToBottom() {
    const chatBody = document.getElementById('chatBody');
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
}
