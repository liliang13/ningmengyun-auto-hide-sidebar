// ==UserScript==
// @name         柠檬云财务自动隐藏右侧栏
// @namespace    local
// @version      1.2.0
// @description  自动收起右侧悬浮栏，并在展开和收起时保持原位置
// @match        https://jpro6.ningmengyun.com/Default/Default*
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
