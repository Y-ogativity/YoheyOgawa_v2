// 言語切り替え用変数
let currentLanguage = 'ja';

// JSONファイルを読み込む関数
async function loadUpdates() {
    // 更新リストのないページでは何もしない
    if (!document.getElementById('update-list')) return;
    try {
        const response = await fetch('updates_Mishima.json');
        const data = await response.json();
        renderUpdates(data.updates);
    } catch (error) {
        console.error("Failed to load updates:", error);
    }
}


// 更新履歴をレンダリングする関数
function renderUpdates(updates) {
    const updateList = document.getElementById('update-list');
    if (!updateList) return;
    //console.log(updateList); // nullなら要素が取得できていない
    updateList.innerHTML = ''; // 一旦リストをクリア
    updates.forEach(update => {
        const listItem = document.createElement('li');
        listItem.textContent = `${update.date} - ${update[currentLanguage]}`;
        updateList.appendChild(listItem);
    });
}

// 言語切り替え関数
function switchLanguage(lang) {
    
    // ページ全体の言語を更新 (メタ情報として適切)
    document.documentElement.lang = lang;
    // for update history
    currentLanguage = lang;
    // persist selection so other pages open in the same language
    try {
        localStorage.setItem('preferredLanguage', lang);
    } catch (error) {
        console.warn('Unable to persist language preference:', error);
    }
    loadUpdates();

    const sections = document.querySelectorAll('[lang]');
    sections.forEach(section => {
        if (section.getAttribute('lang') === lang) {
            section.style.display = ''; // デフォルトの表示
        } else {
            section.style.display = 'none'; // 非表示
        }
    });
}

// toggle navigation
// ナビゲーションメニューの表示/非表示を切り替える関数
function toggleNav() {
    // ナビゲーション要素を取得
    const nav = document.querySelector('nav');
    
    // ナビゲーションメニューに "active" クラスをトグル
    // "active" クラスがあれば削除し、なければ追加する
    nav.classList.toggle('active');
}

// ナビゲーション全体にクリックイベントリスナーを追加
// ナビゲーションをクリックした際に toggleNav 関数を実行
document.querySelector('nav').addEventListener('click', toggleNav);


// ページ初期読み込み時にデフォルトの言語を設定
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    let storedLang = null;
    try {
        storedLang = localStorage.getItem('preferredLanguage');
    } catch (error) {
        console.warn('Unable to read stored language preference:', error);
    }
    const initialLang = (urlLang === 'en' || urlLang === 'ja')
        ? urlLang
        : (storedLang === 'en' ? 'en' : 'ja');
    switchLanguage(initialLang); // URL指定 > 保存値 > 日本語デフォルト
});
