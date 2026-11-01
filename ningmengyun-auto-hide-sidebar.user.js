// ==UserScript==
// @name         自动隐藏柠檬云财务右侧栏
// @namespace    local
// @author       Li Liang
// @version      1.2.1
// @description  自动收起柠檬云财务右侧悬浮栏，并在展开和收起时保持原位置
// @downloadURL  https://raw.githubusercontent.com/liliang13/ningmengyun-auto-hide-sidebar/main/ningmengyun-auto-hide-sidebar.user.js
// @updateURL    https://raw.githubusercontent.com/liliang13/ningmengyun-auto-hide-sidebar/main/ningmengyun-auto-hide-sidebar.user.js
// @match        https://*.ningmengyun.com/*
// @run-at       document-idle
// @noframes
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const hideSidebar = () => {
        const button = document.querySelector('.hide-aside[title="隐藏侧边"]');
        if (!button || button.getClientRects().length === 0) {
            return false;
        }

        const aside = button.closest('.aside');
        const savedTop = aside?.style.top;

        button.click();

        if (aside) {
            let frame;
            const restoreTop = () => {
                cancelAnimationFrame(frame);
                frame = requestAnimationFrame(() => {
                    aside.style.top = savedTop;
                });
            };

            aside.addEventListener('click', event => {
                const item = event.target.closest('.item');
                if (item === button || item === aside.lastElementChild) {
                    restoreTop();
                }
            });
        }

        return true;
    };

    if (hideSidebar()) {
        return;
    }

    const observer = new MutationObserver(() => {
        if (hideSidebar()) {
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
