// ==UserScript==
// @name         토깽이 광고제거
// @namespace    http://tampermonkey.net/
// @version      1.19.11
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

        if (isNewtoki) result = 1.0 * 1000; // newtoki 이면 1초 설정
        else if (isToki) result = 1.0 * 1000; // toki 이면 1초 설정
        else result = 1.0 * 1000; // 그 외엔 1초 설정

        return result;
    }

    // 광고 배너 제거
    async function removeBanners(time) {
        const adBanners = document.querySelectorAll("section[data-br-n]"); // html 중 <section data-br-n=숫자>로 된 태그 데이터의 배열 생성

        // 배열에 데이터가 있다면
        if (adBanners.length > 0) {

            // 타이머가 지나면 코드를 실행
            await setTimeout(() => {
                for (let adBanner of adBanners) adBanner.remove(); // 배열에서 태그를 전부 제거
            }, time);
        }
    }

    // 초창기 팝업 지우기
    function removePopup(curPage) {
        if (curPage != '/') return; // 현재페이지가 초기 페이지가 아니면 함수 중단

        const prefix = "newtoki_popup_hide_";

        if (document.cookie.split(prefix).length - 1 > 2) return; // 3개 팝업 다 설정했다는 것이므로 함수 중단

        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000 * 365).toUTCString(); // 쿠키 수명 조정
        const ids = [2, 4, 6]; // 팝업 배너의 아이디

        for (const id of ids) {
            document.cookie = prefix + id + "=1; expires=" + expires + "; path=/; samesite=lax"; // 쿠키 설정
        }

        const popupRoot = document.querySelector("div[role='dialog']"); // html 중 <div role="dialog">로 된 태그 저장
        if (popupRoot) popupRoot.remove(); // popupRoot가 있다면 제거
    }

    let interval = calInterval(); // 인터벌 계산

    // 광고 제거 로직 반복 구간
    setInterval(async () => {
        let curPage = window.location.pathname; // 현재 페이지

        removePopup(curPage); // 초창기 팝업 제거
        await removeBanners(interval / 5 * 2); // 광고 배너 제거. 0.4초
    }, interval);

})();

