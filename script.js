// ВСЕ ВСТРОЕННЫЕ ТУЛКИ ТЕПЕРЬ СТРОГО В КАТЕГОРИИ УТИЛИТЫ (UTILS)
const utilsDatabase = [
    { name: "Глаз Бога (Eye of God)", description: "СНГ бот для комплексного деанона по открытым базам данных (телефоны, почты, авто).", tag: "telegram бот", url: "https://t.me/GlazBoga" },
    { name: "Sherlock Project", description: "Консольный инструмент для одновременного поиска аккаунтов по одному никнейму на 400+ сайтах.", tag: "софт / cli", url: "https://github.com/sherlock-project/sherlock" },
    { name: "OSINT Framework", description: "Интерактивная карта мировых инструментов, структурированная по категориям поиска.", tag: "каталог", url: "https://osintframework.com" },
    { name: "Shodan", description: "Поисковик по серверам, IoT устройствам, роутерам и открытым сетевым портам.", tag: "сканер сети", url: "https://www.shodan.io" },
    { name: "Have I Been Pwned", description: "Проверка присутствия почтовых адресов и паролей в глобальных хакерских сливах.", tag: "утечки", url: "https://haveibeenpwned.com" },
    { name: "GetContact", description: "Определение тегов телефонных номеров. Показывает, как контакт записан у других людей.", tag: "телефон", url: "https://www.getcontact.com" },
    { name: "IntelX (Intelligence X)", description: "Архивный поисковик по даркнету, историческим утечкам и записям доменов.", tag: "база данных", url: "https://intelx.io" },
    { name: "VirusTotal", description: "Проверка подозрительных файлов, доменов и IP-адресов на наличие вредоносного кода.", tag: "анализ", url: "https://www.virustotal.com" },
    { name: "Censys", description: "Инструмент для поиска хостов, сертификатов безопасности и уязвимостей инфраструктуры.", tag: "инструмент", url: "https://censys.io" },
    { name: "Maigret", description: "Мощный скрипт автоматического сбора досье на человека по юзернейму с проверкой ID.", tag: "скрипт", url: "https://github.com/soomdev/maigret" },
    { name: "QuickOSINT", description: "Telegram-бот для быстрой проверки почт, страниц ВКонтакте и паролей.", tag: "telegram бот", url: "https://t.me/QuickOSINT" },
    { name: "CyberChef", description: "Универсальный веб-инструмент для шифрования, декодирования и парсинга любых массивов данных.", tag: "утилита", url: "https://gchq.github.io/CyberChef" }
];

// Переменные состояния и DOM
let activeModule = 'username'; // По умолчанию активен поиск по нику
const mainContent = document.querySelector('.main-content');
const searchSection = document.getElementById('search-section');
const utilsSection = document.getElementById('utils-section');
const utilsGrid = document.getElementById('utils-grid');

const mainInput = document.getElementById('main-input');
const executeBtn = document.getElementById('execute-btn');
const clearBtn = document.getElementById('clear-btn');
const notifyBox = document.getElementById('notification-box');
const menuItems = document.querySelectorAll('.menu-item');

// Конфигурация типов поиска
const searchConfigs = {
    username: { placeholder: "Введите никнейм (например: alex77)...", title: "filiems-Nickname" },
    ip: { placeholder: "Введите целевой IP-адрес (например: 8.8.8.8)...", title: "filiems-IP" },
    email: { placeholder: "Введите адрес почты (например: target@mail.com)...", title: "filiems-Email" }
};

// Переключение модулей из меню
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        menuItems.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        const moduleType = e.target.getAttribute('data-module');
        activeModule = moduleType;
        
        // Очищаем старые состояния
        resetSearch();

        if (moduleType === 'utils') {
            // Показываем раздел утилит
            searchSection.classList.add('hidden');
            utilsSection.classList.remove('hidden');
            mainContent.style.justifyContent = 'flex-start';
            renderUtils();
        } else {
            // Переключаем тип поиска
            utilsSection.classList.add('hidden');
            searchSection.classList.remove('hidden');
            mainContent.style.justifyContent = 'center';
            
            document.querySelector('.google-logo').innerText = searchConfigs[moduleType].title;
            mainInput.placeholder = searchConfigs[moduleType].placeholder;
        }
    });
});

// Логика кнопки "Поиск"
executeBtn.addEventListener('click', () => {
    const value = mainInput.value.trim();
    if (!value) {
        alert('Строка ввода пуста!');
        return;
    }

    let searchLinks = [];

    if (activeModule === 'username') {
        searchLinks = [
            `https://www.google.com/search?q="${value}"`,
            `https://yandex.ru/search/?text="${value}"`,
            `https://t.me/${value}`,
            `https://github.com/${value}`,
            `https://vk.com/${value}`,
            `https://www.tiktok.com/@${value}`,
            `https://steamcommunity.com/search/users/#text=${value}`,
            `https://www.reddit.com/user/${value}`
        ];
    } else if (activeModule === 'ip') {
        searchLinks = [
            `https://ip-api.com/#${value}`,
            `https://www.shodan.io/host/${value}`,
            `https://www.ipvoid.com/ip-blacklist/${value}`,
            `https://search.censys.io/hosts/${value}`,
            `https://www.abuseipdb.com/check/${value}`
        ];
    } else if (activeModule === 'email') {
        searchLinks = [
            `https://epieos.com/?q=${value}`,
            `https://haveibeenpwned.com/account/${value}`,
            `https://intelx.io/?s=${value}`,
            `https://www.dehashed.com/search?query="${value}"`
        ];
    }

    // Рендерим ровно ОДНО аккуратное уведомление вместо горы кнопок
    notifyBox.innerHTML = `
        <div class="notify-text">
            <h4>Анализ завершен</h4>
            <p>Сформировано запросов к источникам: ${searchLinks.length}</p>
        </div>
        <button id="mass-open-btn" class="launch-btn">Открыть все вкладки</button>
    `;
    notifyBox.classList.remove('hidden');

    // Навешиваем событие на запуск вкладок
    document.getElementById('mass-open-btn').addEventListener('click', () => {
        searchLinks.forEach(url => window.open(url, '_blank'));
    });
});

// Кнопка очистить
clearBtn.addEventListener('click', resetSearch);

function resetSearch() {
    mainInput.value = '';
    notifyBox.innerHTML = '';
    notifyBox.classList.add('hidden');
}

// Отрисовка утилит в грид
function renderUtils() {
    utilsGrid.innerHTML = '';
    utilsDatabase.forEach(item => {
        const card = document.createElement('div');
        card.className = 'osint-card';
        card.innerHTML = `
            <div class="card-top">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            </div>
            <div class="card-bottom">
                <span class="tag">${item.tag}</span>
                <a href="${item.url}" target="_blank" class="visit-link">Открыть ↗</a>
            </div>
        `;
        utilsGrid.appendChild(card);
    });
}
