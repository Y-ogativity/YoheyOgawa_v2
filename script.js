// 言語切り替え用変数
let currentLanguage = 'ja';

// JSONファイルを読み込む関数
async function loadUpdates() {
    try {
        const response = await fetch('updates.json');
        const data = await response.json();
        renderUpdates(data.updates);
    } catch (error) {
        console.error("Failed to load updates:", error);
    }
}


// 更新履歴をレンダリングする関数
function renderUpdates(updates) {
    const updateList = document.getElementById('update-list');
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
function toggleNav() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}

// ページ初期読み込み時にデフォルトの言語を設定
document.addEventListener('DOMContentLoaded', () => {
    switchLanguage('ja'); // 日本語をデフォルトに設定
});

// スクリプトがHTML要素より先に実行されないようにするために使用します。
document.addEventListener('DOMContentLoaded', () => {
    //const updateList = document.getElementById('update-list');
    //console.log(updateList); // これで確認
    loadUpdates(); // ページ読み込み時に更新履歴を読み込む
});
