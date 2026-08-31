// ==UserScript==
// @name         토깽이 광고제거
// @namespace    http://tampermonkey.net/
// @version      1.18.2
// @description  토깽이 광고지우는 용도
// @author       NoAD
// @match        *://newtoki1.org/*
// @match        *://*.newtoki1.org/*
// @match        *://toki31.com/*
// @match        *://*.toki31.com/*
// @match        *://sbxh9.com/*
// @match        *://*.sbxh9.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newtoki1.org
// @grant        none
// ==/UserScript==
(async () => {

    // 광고 제거 로직 '반복 시간(인터벌)' 계산
    function calInterval() {
        let result = 0;
        const isNewtoki = window.location.hostname.includes("newtoki"); // 도메인에 "newtoki"가 있는지 확인
        const isToki = window.location.hostname.includes("toki"); // 도메인에 "toki"가 있는지 확인

        if (isNewtoki) result = 1.2 * 1000; // newtoki 이면 1.2초 설정
        else if (isToki) result = 2 * 1000; // toki 이면 2초 설정
        else result = 2.5 * 1000; // 그 외엔 2.5초 설정

        return result;
    }

    // 제거 로직이 반복될 때마다 같은 페이지인지 확인
    function notEqualPage(pre, cur) {
        return pre != cur;
    }

    // 광고를 페이지가 변경되고 바로 제거하지 않기 위함
    async function sleep(interval) {
        await setTimeout(() => { }, interval);
    }

    // 광고 배너 제거
    function removeBanners() {
        const adBanners = window.document.querySelectorAll("section[data-br-n]"); // html 중 <section data-br-n=숫자>로 된 태그 데이터의 배열 생성

        for (let adBanner of adBanners) adBanner.remove(); // 배열에서 태그를 전부 제거
    }

    // 초창기 팝업 지우기
    function removePopup(curPage) {
        if (curPage != '/') return; // 현재페이지가 초기 페이지가 아니면 함수 중단

        const prefix = "newtoki_popup_hide_";

        if (window.document.cookie.split(prefix).length - 1 > 2) return; // 3개 팝업 다 설정했다는 것이므로 함수 중단

        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000 * 365).toUTCString(); // 쿠키 수명 조정
        const ids = [2, 4, 6]; // 팝업 배너의 아이디

        for (const id of ids) {
            document.cookie = prefix + id + "=1; expires=" + expires + "; path=/; samesite=lax"; // 쿠키 설정
        }

        const popupRoot = window.document.querySelector("div[role='dialog']"); // html 중 <div role="dialog">로 된 태그 저장
        if (popupRoot) popupRoot.remove(); // popupRoot가 있다면 제거
    }


    let interval = calInterval(); // 인터벌 계산
    let prePage = ""; // 저번 페이지

    // 광고 제거 로직 반복 구간
    setInterval(async () => {
        let curPage = window.location.pathname; // 현재 페이지

        removePopup(curPage); // 초창기 팝업 제거

        // 페이지가 같은지 확인
        if (notEqualPage(prePage, curPage)) {
            prePage = curPage; // 다른 페이지이면 저번 페이지에 현재 페이지 값을 저장
            await sleep(interval / 2); // 광고가 바로 지워지지 않도록 시간 끌기
        };

        removeBanners(); // 광고 배너 제거
    }, interval);
})();

