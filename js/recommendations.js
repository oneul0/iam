document.addEventListener('DOMContentLoaded', () => {
    initBakerySliders();
    initEasterEggSystem();
});

function initBakerySliders() {
    document.querySelectorAll('.post-slider-container').forEach((container) => {
        const track = container.querySelector('.post-slider-track');
        const items = track?.querySelectorAll('.slide-item');
        if (!track || !items?.length) return;

        let isDragging = false;
        let startX = 0;
        let previousTranslate = 0;
        let currentIndex = 0;

        container.addEventListener('mousedown', (event) => {
            if (event.target.classList.contains('easter-egg')) return;
            isDragging = true;
            startX = event.pageX;
            container.style.cursor = 'grabbing';
        });

        container.addEventListener('mousemove', (event) => {
            if (!isDragging) return;
            track.style.transform = `translateX(${previousTranslate + event.pageX - startX}px)`;
        });

        function endDrag(event) {
            if (!isDragging) return;

            isDragging = false;
            container.style.cursor = 'grab';

            const movedBy = (event.pageX || startX) - startX;
            if (movedBy < -50 && currentIndex < items.length - 1) currentIndex += 1;
            if (movedBy > 50 && currentIndex > 0) currentIndex -= 1;

            previousTranslate = currentIndex * -container.clientWidth;
            track.style.transform = `translateX(${previousTranslate}px)`;
        }

        container.addEventListener('mouseup', endDrag);
        container.addEventListener('mouseleave', endDrag);
    });
}

function initEasterEggSystem() {
    const eggs = [...document.querySelectorAll('.easter-egg')];
    const validIds = eggs.map((egg) => egg.dataset.id);
    let foundItems = getFoundItems(validIds);

    eggs.forEach((egg) => {
        if (foundItems.includes(egg.dataset.id)) egg.classList.add('found');

        egg.addEventListener('click', (event) => {
            event.stopPropagation();

            const id = egg.dataset.id;
            if (!id || foundItems.includes(id)) return;

            foundItems.push(id);
            localStorage.setItem('found_items', JSON.stringify(foundItems));
            egg.classList.add('found');

            const itemName = id === 'item_coffee' ? '☕ 커피 조각' : '🏋️‍♂️ 덤벨 조각';
            window.triggerCameraNotification?.(`${itemName} 획득! (${foundItems.length}/${eggs.length})`);

            if (foundItems.length === eggs.length) {
                setTimeout(() => {
                    document.getElementById('gameModal')?.classList.add('active');
                }, 800);
            }
        });
    });

    document.getElementById('btnCloseModal')?.addEventListener('click', () => {
        document.getElementById('gameModal')?.classList.remove('active');
    });
}

function getFoundItems(validIds) {
    try {
        const savedItems = JSON.parse(localStorage.getItem('found_items') || '[]');
        return Array.isArray(savedItems)
            ? savedItems.filter((id) => validIds.includes(id))
            : [];
    } catch {
        return [];
    }
}