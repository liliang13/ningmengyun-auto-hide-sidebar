// ==UserScript==
// @name         柠檬云财务自动隐藏右侧栏
// @namespace    local
// @version      1.3.2
// @description  自动收起右侧悬浮栏，并在每次展开/收起时保持原位置
// @downloadURL  https://raw.githubusercontent.com/liliang13/ningmengyun-auto-hide-sidebar/main/ningmengyun-auto-hide-sidebar.user.js
// @updateURL    https://raw.githubusercontent.com/liliang13/ningmengyun-auto-hide-sidebar/main/ningmengyun-auto-hide-sidebar.user.js
// @match        https://jpro6.ningmengyun.com/Default/Default*
// @run-at       document-idle
// @noframes
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let lastTop = null;

    const getAside = () => document.querySelector('.aside');

    const saveTop = (aside) => {
        if (!aside) return;
        const top = aside.style.top || getComputedStyle(aside).top;
        if (top && top !== 'auto') {
            lastTop = top;
        }
    };

    const enforceTop = (aside) => {
        if (!aside || lastTop === null) return;
        aside.style.setProperty('top', lastTop, 'important');
        requestAnimationFrame(() => aside.style.setProperty('top', lastTop, 'important'));
        setTimeout(() => aside.style.setProperty('top', lastTop, 'important'), 50);
    };

    const tryAutoHide = () => {
        const button = document.querySelector('.hide-aside[title="隐藏侧边"]');
        if (!button || button.getClientRects().length === 0) {
            return false;
        }

        const aside = button.closest('.aside');
        saveTop(aside);
        button.click();
        enforceTop(aside);
        bindToggleClicks(aside);
        return true;
    };

    const bindToggleClicks = (aside) => {
        if (!aside || aside.dataset.nmToggleBound) return;
        aside.dataset.nmToggleBound = '1';

        aside.addEventListener('click', (event) => {
            const toggle = event.target.closest('.hide-aside, .show-aside, .item');
            if (!toggle) return;
            const currentAside = toggle.closest('.aside');
            saveTop(currentAside);
            setTimeout(() => enforceTop(currentAside), 0);
            setTimeout(() => enforceTop(currentAside), 50);
        });
    };

    if (tryAutoHide()) {
        return;
    }

    const observer = new MutationObserver(() => {
        if (tryAutoHide()) {
            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
})();
