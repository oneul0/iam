document.addEventListener('DOMContentLoaded', async () => {
    initHardwareAndStatus();
    await loadNavigation();
});

async function loadNavigation() {
    const container = document.getElementById(
        'navigation-container'
    );

    if (!container) return;

    try {
        const response = await fetch(
            '/html/includes/nav.html'
        );

        if (!response.ok) {
            throw new Error(
                `네비게이션 로드 실패: ${response.status}`
            );
        }

        container.innerHTML = await response.text();

        initActiveNavigation();
        initMpaNavigationGuard();
    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <p class="navigation-error">
                메뉴를 불러오지 못했습니다.
            </p>
        `;
    }
}

function initActiveNavigation() {
    const currentPage =
        window.location.pathname.split('/').pop() ||
        'index.html';

    document
        .querySelectorAll('.galaxy-nav-bar .nav-item')
        .forEach((link) => {
            const linkPage = new URL(
                link.href,
                window.location.href
            ).pathname.split('/').pop();

            const isCurrentPage =
                linkPage === currentPage;

            link.classList.toggle(
                'active',
                isCurrentPage
            );

            if (isCurrentPage) {
                link.setAttribute(
                    'aria-current',
                    'page'
                );
            } else {
                link.removeAttribute('aria-current');
            }
        });
}

function initHardwareAndStatus() {
    const powerBtn =
        document.querySelector('.power-btn');

    const volumeUpBtn =
        document.querySelector('.volume-up');

    const volumeDownBtn =
        document.querySelector('.volume-down');

    const phoneContainer =
        document.querySelector('.phone-container');

    const timeDisplay =
        document.querySelector('.status-time');

    const batteryDisplay =
        document.querySelector('.status-icons');

    if (!phoneContainer) return;

    let isPowerOn = true;
    let currentVolume = 70;
    let volumeTimeout;

    phoneContainer.insertAdjacentHTML(
        'beforeend',
        `
            <div class="volume-bar-container">
                <div
                    class="volume-level"
                    style="height: ${currentVolume}%"
                ></div>
            </div>
        `
    );

    const volumeBarContainer =
        phoneContainer.querySelector(
            '.volume-bar-container'
        );

    const volumeLevel =
        phoneContainer.querySelector(
            '.volume-level'
        );

    powerBtn?.addEventListener('click', () => {
        isPowerOn = !isPowerOn;

        phoneContainer.classList.toggle(
            'power-off',
            !isPowerOn
        );

        if (!isPowerOn) {
            volumeBarContainer?.classList.remove(
                'active'
            );

            return;
        }

        const activeSection =
            document.querySelector(
                '.app-section.active'
            );

        if (activeSection) {
            activeSection.style.animation = 'none';

            void activeSection.offsetHeight;

            activeSection.style.animation = '';
        }
    });

    function updateVolume(amount) {
        if (!isPowerOn) return;

        currentVolume = Math.min(
            100,
            Math.max(
                0,
                currentVolume + amount
            )
        );

        if (volumeLevel) {
            volumeLevel.style.height =
                `${currentVolume}%`;
        }

        volumeBarContainer?.classList.add(
            'active'
        );

        clearTimeout(volumeTimeout);

        volumeTimeout = setTimeout(() => {
            volumeBarContainer?.classList.remove(
                'active'
            );
        }, 1500);
    }

    volumeUpBtn?.addEventListener(
        'click',
        () => updateVolume(10)
    );

    volumeDownBtn?.addEventListener(
        'click',
        () => updateVolume(-10)
    );

    function updateClock() {
        const now = new Date();

        const hours = String(
            now.getHours()
        ).padStart(2, '0');

        const minutes = String(
            now.getMinutes()
        ).padStart(2, '0');

        if (timeDisplay) {
            timeDisplay.textContent =
                `${hours}:${minutes}`;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    if (
        navigator.getBattery &&
        batteryDisplay
    ) {
        navigator.getBattery().then((battery) => {
            function updateBatteryInfo() {
                const level = Math.floor(
                    battery.level * 100
                );

                const charging =
                    battery.charging ? '⚡ ' : '';

                batteryDisplay.textContent =
                    `LTE ${charging}🔋 ${level}%`;
            }

            updateBatteryInfo();

            battery.addEventListener(
                'levelchange',
                updateBatteryInfo
            );

            battery.addEventListener(
                'chargingchange',
                updateBatteryInfo
            );
        });
    }
}

function initMpaNavigationGuard() {
    const phoneContainer =
        document.querySelector(
            '.phone-container'
        );

    document
        .querySelectorAll('.galaxy-nav-bar a')
        .forEach((link) => {
            link.addEventListener(
                'click',
                (event) => {
                    const isPowerOff =
                        phoneContainer?.classList
                            .contains('power-off');

                    if (isPowerOff) {
                        event.preventDefault();
                    }
                }
            );
        });
}

window.triggerCameraNotification = function (
    message
) {
    const cameraIsland =
        document.querySelector('.camera-island');

    const phoneContainer =
        document.querySelector(
            '.phone-container'
        );

    if (
        !cameraIsland ||
        phoneContainer?.classList.contains(
            'power-off'
        )
    ) {
        return;
    }

    const messageElement =
        document.createElement('span');

    messageElement.textContent = message;

    cameraIsland.replaceChildren(
        messageElement
    );

    cameraIsland.classList.add(
        'dynamic-notification'
    );

    setTimeout(() => {
        cameraIsland.classList.remove(
            'dynamic-notification'
        );

        setTimeout(() => {
            cameraIsland.replaceChildren();
        }, 400);
    }, 2500);
};