const GAME_ITEM_IDS = ['item_coffee', 'item_dumbbell'];

document.addEventListener('DOMContentLoaded', () => {
    const btnReset = document.getElementById('btnResetGame');
    updateHomeGameDashboard();

    btnReset?.addEventListener('click', () => {
        if (!confirm('수집한 조각 내역을 전부 리셋하고 다시 시작할까요?')) return;

        localStorage.removeItem('found_items');
        updateHomeGameDashboard();
        window.triggerCameraNotification?.('🔄 수집 내역 초기화 완료');
    });
});

function getFoundGameItems() {
    try {
        const savedItems = JSON.parse(localStorage.getItem('found_items') || '[]');
        return Array.isArray(savedItems)
            ? savedItems.filter((id) => GAME_ITEM_IDS.includes(id))
            : [];
    } catch {
        return [];
    }
}

function updateHomeGameDashboard() {
    const current = getFoundGameItems().length;
    const total = GAME_ITEM_IDS.length;
    const progressBar = document.getElementById('gameProgress');
    const countText = document.getElementById('gameCountText');

    if (progressBar) progressBar.style.width = `${(current / total) * 100}%`;
    if (countText) countText.textContent = `찾은 조각: ${current} / ${total}`;
}