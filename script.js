// فتح وإغلاق القائمة عند الضغط على زر القائمة
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

if (navToggle) { navToggle.addEventListener('click', () => { navMenu.classList.add('show-menu'); }); }
if (navClose) { navClose.addEventListener('click', () => { navMenu.classList.remove('show-menu'); }); }

// فتح القوائم الفرعية عند الضغط على الروابط التي تحتوي على قوائم فرعية
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const sublist = item.querySelector('.nav-sublist1, .nav-sublist2');

    if (sublist) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sublist.classList.toggle('show-sublist'); }); } });

// إغلاق القائمة عند الضغط على الروابط العادية فقط
const navLinks = document.querySelectorAll('.nav-link:not(:has(.nav-sublist1, .nav-sublist2))');
navLinks.forEach(link => { link.addEventListener('click', () => { navMenu.classList.remove('show-menu'); }); });

// منع مستخدمين الأجهزة الأصغر من 767px من التمرير بالموقع والقائمة مفتوحة والسماح لهم عند إغلاقها
document.querySelector('.nav-toggle').addEventListener('click', function() {document.body.style.overflow = 'hidden'})
document.querySelector('.nav-close').addEventListener('click', function() {document.body.style.overflow = 'auto'})
document.querySelectorAll('.nav-item').forEach(function(navItem) {navItem.addEventListener('click', function() {document.body.style.overflow = 'auto'})})

// التسوق
document.addEventListener('DOMContentLoaded', function () {
    // السلة
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('#total-price');
    const cartSection = document.querySelector('.cert');
    const currencySelector = document.getElementById('currency');

    // أسعار الصرف الافتراضية
    const defaultRates = {
        sar: 1,
        usd: 0.27,
        aed: 0.98,
        kwd: 0.082,
        qar: 0.97,
        bhd: 0.10,
        omr: 0.10,
        iqd: 348.32,
        yer: 66.34,
        jod: 0.19,
        lbp: 23815.86,
        syp: 3459.29,
        egp: 13.19,
        sdg: 14.67,
        lyd: 1.30,
        tnd: 0.84,
        dzd: 35.48,
        mad: 2.67,
        mru: 10.58,
        ils: 0.97,
        sos: 151.14,
        kmf: 124.68,
        djf: 47.26,
        eur: 0.25,
        try: 9.22,
        sek: 2.93 };

    // دالة لإظهار تنبيهات
    function showAlert(message, type = 'info') {
        const alertBox = document.createElement('div');
        alertBox.className = `alert-box ${type}`;
        alertBox.textContent = message;

        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => alertBox.remove(), 500);
        }, 3000); }

    // دالة لتحويل الأسعار حسب العملة
    function convertPrice(price, currency) {
        if (!defaultRates [currency]) {
            console.error(`العملة ${currency} غير مدعومة.`);
            return price; }
        return (price * defaultRates [currency]).toFixed(2); }

    // عرض محتويات السلة
    function displayCartItems() {
        cartContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <span>${convertPrice(item.price, currencySelector.value)} ${currencySelector.options[currencySelector.selectedIndex].text.split(' - ')[0]}</span>
                <button class="remove-btn" onclick="removeFromCart('${item.name}')">حذف</button>
            `;
            cartContainer.appendChild(cartItem);
        }); }

    // تحديث إجمالي السعر
    function updateTotalPrice() {
        const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0);
        const convertedPrice = convertPrice(totalPrice, currencySelector.value);
        totalPriceElement.textContent = `${convertedPrice} ${currencySelector.options[currencySelector.selectedIndex].text.split(' - ')[0]}`; }

    // تحديث عدد العناصر في السلة
    function updateCartCount() { document.querySelector('.cart-count').textContent = cart.length; }

    // حذف منتج من السلة
    window.removeFromCart = function (name) {
        cart = cart.filter(item => item.name !== name);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateTotalPrice();
        updateCartCount(); };

    // دالة زر اشترِ الآن
    window.redirectToPayment = function (price, currency, productId, productName) {
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            console.error(`⚠️ السعر غير صالح للمنتج "${productName}" : ${price}`);
            return; }
    
        if (!defaultRates[currency.toLowerCase()]) {
            console.error(`⚠️ العملة غير مدعومة: ${currency}`);
            alert(`⚠️ العملة غير مدعومة : ${currency}`);
            return; }
    
        window.location.href = `payment/index.html`; };
    
    // إعادة التوجيه إلى صفحة الدفع للسلة
    window.redirectCartToPayment = function () {
        if (cart.length === 0) {
            showAlert('السلة فارغة!', 'error');
            return; }

        window.location.href = `payment/index.html`; };

    // إضافة منتج إلى السلة
    function addToCart(name, price) {
        const productExists = cart.some(item => item.name === name);
        if (!productExists) {
            const selectedCurrency = currencySelector.value;
            cart.push({ 
                name, 
                price,
                currency: selectedCurrency  });
            localStorage.setItem('cart', JSON.stringify(cart));

            showAlert(`تمت إضافة "${name}" إلى السلة بنجاح 😎`, 'success');
            updateCartCount();
            displayCartItems();
            updateTotalPrice();
        } 
        else { showAlert(`"${name}" موجود فعليا في السلة!`, 'warning'); } }

    // زر إضافة إلى السلة
    document.querySelectorAll('.to-cert-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const productName = button.getAttribute('data-name');
            const productPrice = button.getAttribute('data-price');
            if (!productName || !productPrice) {
                console.error('تفاصيل المنتج مفقودة.');
                return; }

            addToCart(productName, parseFloat(productPrice)); }); });

    // فتح السلة عند الضغط على زرها
    document.querySelector('.cert-btn a').addEventListener('click', (event) => {
        event.preventDefault();
        cartSection.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        displayCartItems();
        updateTotalPrice();
        updateCartCount(); });

    // إغلاق السلة عند الضغط على زر الإغلاق
    document.querySelector('.cert-close').addEventListener('click', () => {
        cartSection.style.display = 'none';
        document.body.style.overflow = 'auto'; });

    // زر تفريغ السلة
    document.querySelector('.clear-cart-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            showAlert('السلة فارغة بالفعل', 'error');
            return; }

        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateTotalPrice();
        updateCartCount(); });

    // زر إكمال التسوق
    document.querySelector('.continue-shopping-btn').addEventListener('click', () => {
        cartSection.style.display = 'none';
        document.body.style.overflow = 'auto'; });

    // تحديث الأسعار عند تغيير العملة
    currencySelector.addEventListener('change', () => {
        displayCartItems();
        updateTotalPrice(); });

    // نفذ التغيير أول مرة بعد التحديد الآلي
    currencySelector.dispatchEvent(new Event('change'));

    // عرض السلة عند التحميل
    displayCartItems();
    updateTotalPrice();
    updateCartCount(); });

// الموافقة على السياسات
function toggleBuyButton(checkbox) {
    const buyBtns = document.querySelectorAll('.buy-btn');
    buyBtns.forEach(btn => {
        if (checkbox.checked) {
            btn.classList.remove('disabled');
            btn.removeAttribute('disabled'); } 
        else {
            btn.classList.add('disabled');
            btn.setAttribute('disabled', 'disabled'); } });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkbox.checked) {
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.removeAttribute('disabled'); } 
    else {
        checkoutBtn.classList.add('disabled');
        checkoutBtn.setAttribute('disabled', 'disabled'); }}

// أوامر لقسم المنتجات
let preveiwContainer = document.querySelector('.products-preview');
let previewBox = preveiwContainer.querySelectorAll('.preview');

document.querySelectorAll('.product').forEach(product => {
    product.onclick = () => {
        preveiwContainer.style.display = 'flex';
        let name = product.getAttribute('data-name');
        previewBox.forEach(preview => {
            let target = preview.getAttribute('data-target');
            if (name == target){
                preview.classList.add('active');
                document.body.style.overflow = 'hidden'; } }); } });

previewBox.forEach(close => {
    close.querySelector('.products-preview-close').onclick = () => {
        close.classList.remove('active');
        preveiwContainer.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    } });

// تصنيفات المنتجات
document.getElementById('categories').addEventListener('change', function() {
    const selectedCategory = this.value;
    const products = document.querySelectorAll('.product');
    const productsContainer = document.querySelector('.products-container2');

    let visibleCount = 0;
    
    products.forEach(product => {
        const productCategories = product.getAttribute('data-category').split(' ');
        if (selectedCategory === 'all') { 
            product.style.display = 'block';
            visibleCount++; } 
        else if (productCategories.includes(selectedCategory)) { 
            product.style.display = 'block';
            visibleCount++; } 
        else {  product.style.display = 'none';  }});

    if (visibleCount === 1) { productsContainer.classList.add('single-product'); } 
    else { productsContainer.classList.remove('single-product'); }});

// أسعار صرف العملات
const apiKey = '95b51b1edd234510be68a0b5a8f9407a';
const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

// دالة لتخزين السعر الأصلي في وسوم del عند أول تحميل
function storeOriginalPrices() {
    // تخزين الأسعار الأصلية في المنتجات العادية
    document.querySelectorAll('.product del').forEach(delElement => {
        if (!delElement.hasAttribute('data-original-price')) {
            delElement.setAttribute('data-original-price', delElement.textContent.trim());
        }
    });
    
    // تخزين الأسعار الأصلية في الصفحات المنبثقة
    document.querySelectorAll('.products-preview .preview del').forEach(delElement => {
        if (!delElement.hasAttribute('data-original-price')) {
            delElement.setAttribute('data-original-price', delElement.textContent.trim());
        }
    });
}

// تنفيذ دالة تخزين الأسعار الأصلية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', storeOriginalPrices);

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const defaultRates = data.rates;

        document.getElementById('currency').addEventListener('change', function() {
            const selectedCurrency = this.value;
            const products = document.querySelectorAll('.product');
            const previews = document.querySelectorAll('.products-preview .preview');

            // تحديث الأسعار في المنتجات العادية
            products.forEach(product => {
                const priceElement = product.querySelector('.product-price');
                const priceSar = parseFloat(priceElement.getAttribute('data-price-sar'));
                
                // تحديث وسم del للسعر الأصلي قبل الخصم
                const delElement = product.querySelector('del');
                let newPrice, newDelPrice;

                if(!isNaN(priceSar)) {
                    const priceInUsd = priceSar / defaultRates.SAR;
                    
                    // إذا وجد وسم del، قم بتحديثه أيضاً
                    if (delElement) {
                        // استخدم القيمة الأصلية المخزنة في data-original-price
                        const originalPrice = delElement.getAttribute('data-original-price');
                        const originalPriceSar = parseFloat(originalPrice);
                        
                        if (!isNaN(originalPriceSar)) {
                            const originalPriceInUsd = originalPriceSar / defaultRates.SAR;
                            
                            switch (selectedCurrency) {
                                case 'sar':
                                    newDelPrice = originalPriceSar.toFixed(2);
                                    break;
                                case 'aed':
                                    newDelPrice = (originalPriceInUsd * defaultRates.AED).toFixed(2);
                                    break;
                                case 'kwd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.KWD).toFixed(2);
                                    break;
                                case 'qar':
                                    newDelPrice = (originalPriceInUsd * defaultRates.QAR).toFixed(2);
                                    break;
                                case 'bhd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.BHD).toFixed(2);
                                    break;
                                case 'omr':
                                    newDelPrice = (originalPriceInUsd * defaultRates.OMR).toFixed(2);
                                    break;
                                case 'yer':
                                    newDelPrice = (originalPriceInUsd * defaultRates.YER).toFixed(2);
                                    break;
                                case 'jod':
                                    newDelPrice = (originalPriceInUsd * defaultRates.JOD).toFixed(2);
                                    break;
                                case 'iqd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.IQD).toFixed(2);
                                    break;
                                case 'lbp':
                                    newDelPrice = (originalPriceInUsd * defaultRates.LBP).toFixed(2);
                                    break;
                                case 'syp':
                                    newDelPrice = (originalPriceInUsd * defaultRates.SYP).toFixed(2);
                                    break;
                                case 'egp':
                                    newDelPrice = (originalPriceInUsd * defaultRates.EGP).toFixed(2);
                                    break;
                                case 'sdg':
                                    newDelPrice = (originalPriceInUsd * defaultRates.SDG).toFixed(2);
                                    break;
                                case 'lyd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.LYD).toFixed(2);
                                    break;
                                case 'tnd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.TND).toFixed(2);
                                    break;
                                case 'dzd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.DZD).toFixed(2);
                                    break;
                                case 'mad':
                                    newDelPrice = (originalPriceInUsd * defaultRates.MAD).toFixed(2);
                                    break;
                                case 'mru':
                                    newDelPrice = (originalPriceInUsd * defaultRates.MRU).toFixed(2);
                                    break;
                                case 'ils':
                                    newDelPrice = (originalPriceInUsd * defaultRates.ILS).toFixed(2);
                                    break;
                                case 'sos':
                                    newDelPrice = (originalPriceInUsd * defaultRates.SOS).toFixed(2);
                                    break;
                                case 'kmf':
                                    newDelPrice = (originalPriceInUsd * defaultRates.KMF).toFixed(2);
                                    break;
                                case 'djf':
                                    newDelPrice = (originalPriceInUsd * defaultRates.DJF).toFixed(2);
                                    break;
                                case 'usd':
                                    newDelPrice = originalPriceInUsd.toFixed(2);
                                    break;
                                case 'eur':
                                    newDelPrice = (originalPriceInUsd * defaultRates.EUR).toFixed(2);
                                    break;
                                case 'try':
                                    newDelPrice = (originalPriceInUsd * defaultRates.TRY).toFixed(2);
                                    break;
                                case 'sek':
                                    newDelPrice = (originalPriceInUsd * defaultRates.SEK).toFixed(2);
                                    break;
                                default:
                                    newDelPrice = originalPriceSar.toFixed(2);
                                    break;
                            }
                            
                            delElement.textContent = newDelPrice;
                        }
                    }
                    
                    // تحديث السعر الحالي (بعد الخصم)
                    switch (selectedCurrency) {
                        case 'sar':
                            newPrice = priceSar.toFixed(2) + 'ر.س';
                            break;
                        case 'aed':
                            newPrice = (priceInUsd * defaultRates.AED).toFixed(2) + 'د.إ';
                            break;
                        case 'kwd':
                            newPrice = (priceInUsd * defaultRates.KWD).toFixed(2) + 'د.ك';
                            break;
                        case 'qar':
                            newPrice = (priceInUsd * defaultRates.QAR).toFixed(2) + 'ر.ق';
                            break;
                        case 'bhd':
                            newPrice = (priceInUsd * defaultRates.BHD).toFixed(2) + 'د.ب';
                            break;
                        case 'omr':
                            newPrice = (priceInUsd * defaultRates.OMR).toFixed(2) + 'ر.ع';
                            break;
                        case 'yer':
                            newPrice = (priceInUsd * defaultRates.YER).toFixed(2) + 'ر.ي';
                            break;
                        case 'jod':
                            newPrice = (priceInUsd * defaultRates.JOD).toFixed(2) + 'د.أ';
                            break;
                        case 'iqd':
                            newPrice = (priceInUsd * defaultRates.IQD).toFixed(2) + 'د.ع';
                            break;
                        case 'lbp':
                            newPrice = (priceInUsd * defaultRates.LBP).toFixed(2) + 'ل.ل';
                            break;
                        case 'syp':
                            newPrice = (priceInUsd * defaultRates.SYP).toFixed(2) + 'ل.س';
                            break;
                        case 'egp':
                            newPrice = (priceInUsd * defaultRates.EGP).toFixed(2) + 'ج.م';
                            break;
                        case 'sdg':
                            newPrice = (priceInUsd * defaultRates.SDG).toFixed(2) + 'ج.س';
                            break;
                        case 'lyd':
                            newPrice = (priceInUsd * defaultRates.LYD).toFixed(2) + 'د.ل';
                            break;
                        case 'tnd':
                            newPrice = (priceInUsd * defaultRates.TND).toFixed(2) + 'د.ت';
                            break;
                        case 'dzd':
                            newPrice = (priceInUsd * defaultRates.DZD).toFixed(2) + 'د.ج';
                            break;
                        case 'mad':
                            newPrice = (priceInUsd * defaultRates.MAD).toFixed(2) + 'د.م';
                            break;
                        case 'mru':
                            newPrice = (priceInUsd * defaultRates.MRU).toFixed(2) + 'أ.م';
                            break;
                        case 'ils':
                            newPrice = (priceInUsd * defaultRates.ILS).toFixed(2) + '₪';
                            break;
                        case 'sos':
                            newPrice = (priceInUsd * defaultRates.SOS).toFixed(2) + 'ش.ص';
                            break;
                        case 'kmf':
                            newPrice = (priceInUsd * defaultRates.KMF).toFixed(2) + 'ف.ق';
                            break;
                        case 'djf':
                            newPrice = (priceInUsd * defaultRates.DJF).toFixed(2) + 'ف.ج';
                            break;
                        case 'usd':
                            newPrice = priceInUsd.toFixed(2) + '$';
                            break;
                        case 'eur':
                            newPrice = (priceInUsd * defaultRates.EUR).toFixed(2) + '€';
                            break;
                        case 'try':
                            newPrice = (priceInUsd * defaultRates.TRY).toFixed(2) + '₺';
                            break;
                        case 'sek':
                            newPrice = (priceInUsd * defaultRates.SEK).toFixed(2) + 'كر';
                            break;
                        default:
                            newPrice = priceSar.toFixed(2) + 'ر.س';
                            break; 
                    } 
                }
                else { 
                    newPrice = 'مجاني'; 
                }

                priceElement.textContent = newPrice; 
            });

            // تحديث الأسعار في الصفحات المنبثقة
            previews.forEach(preview => {
                const priceElements = preview.querySelectorAll('.product-price'); 
                
                // تحديث وسوم del في الصفحات المنبثقة
                const delElements = preview.querySelectorAll('del');
                
                // تحديث وسوم del للسعر الأصلي قبل الخصم
                if (delElements.length > 0) {
                    delElements.forEach(delElement => {
                        // استخدم القيمة الأصلية المخزنة في data-original-price
                        const originalPrice = delElement.getAttribute('data-original-price');
                        const originalPriceSar = parseFloat(originalPrice);
                        
                        if (!isNaN(originalPriceSar)) {
                            const originalPriceInUsd = originalPriceSar / defaultRates.SAR;
                            let newDelPrice;
                            
                            switch (selectedCurrency) {
                                case 'sar':
                                    newDelPrice = originalPriceSar.toFixed(2);
                                    break;
                                case 'aed':
                                    newDelPrice = (originalPriceInUsd * defaultRates.AED).toFixed(2);
                                    break;
                                case 'kwd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.KWD).toFixed(2);
                                    break;
                                case 'qar':
                                    newDelPrice = (originalPriceInUsd * defaultRates.QAR).toFixed(2);
                                    break;
                                case 'bhd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.BHD).toFixed(2);
                                    break;
                                case 'omr':
                                    newDelPrice = (originalPriceInUsd * defaultRates.OMR).toFixed(2);
                                    break;
                                case 'yer':
                                    newDelPrice = (originalPriceInUsd * defaultRates.YER).toFixed(2);
                                    break;
                                case 'jod':
                                    newDelPrice = (originalPriceInUsd * defaultRates.JOD).toFixed(2);
                                    break;
                                case 'iqd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.IQD).toFixed(2);
                                    break;
                                case 'lbp':
                                    newDelPrice = (originalPriceInUsd * defaultRates.LBP).toFixed(2);
                                    break;
                                case 'syp':
                                    newDelPrice = (originalPriceInUsd * defaultRates.SYP).toFixed(2);
                                    break;
                                case 'egp':
                                    newDelPrice = (originalPriceInUsd * defaultRates.EGP).toFixed(2);
                                    break;
                                case 'sdg':
                                    newDelPrice = (originalPriceInUsd * defaultRates.SDG).toFixed(2);
                                    break;
                                case 'lyd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.LYD).toFixed(2);
                                    break;
                                case 'tnd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.TND).toFixed(2);
                                    break;
                                case 'dzd':
                                    newDelPrice = (originalPriceInUsd * defaultRates.DZD).toFixed(2);
                                    break;
                                case 'mad':
                                    newDelPrice = (originalPriceInUsd * defaultRates.MAD).toFixed(2);
                                    break;
                                case 'mru':
                                    newDelPrice = (originalPriceInUsd * defaultRates.MRU).toFixed(2);
                                    break;
                                case 'ils':
                                    newDelPrice = (originalPriceInUsd * defaultRates.ILS).toFixed(2);
                                    break;
                                case 'sos':
                                    newDelPrice = (originalPriceInUsd * defaultRates.SOS).toFixed(2);
                                    break;
                                case 'kmf':
                                    newDelPrice = (originalPriceInUsd * defaultRates.KMF).toFixed(2);
                                    break;
                                case 'djf':
                                    newDelPrice = (originalPriceInUsd * defaultRates.DJF).toFixed(2);
                                    break;
                                case 'usd':
                                    newDelPrice = originalPriceInUsd.toFixed(2);
                                    break;
                                case 'eur':
                                    newDelPrice = (originalPriceInUsd * defaultRates.EUR).toFixed(2);
                                    break;
                                case 'try':
                                    newDelPrice = (originalPriceInUsd * defaultRates.TRY).toFixed(2);
                                    break;
                                case 'sek':
                                    newDelPrice = (originalPriceInUsd * defaultRates.SEK).toFixed(2);
                                    break;
                                default:
                                    newDelPrice = originalPriceSar.toFixed(2);
                                    break;
                            }
                            
                            delElement.textContent = newDelPrice;
                        }
                    });
                }
                
                // تحديث الأسعار الحالية
                priceElements.forEach(priceElement => {
                    const priceSar = parseFloat(priceElement.getAttribute('data-price-sar'));
                    let newPrice;

                    if(!isNaN(priceSar)) {
                        const priceInUsd = priceSar / defaultRates.SAR;

                        switch (selectedCurrency) {
                            case 'sar':
                                newPrice = priceSar.toFixed(2) + 'ر.س';
                                break;
                            case 'aed':
                                newPrice = (priceInUsd * defaultRates.AED).toFixed(2) + 'د.إ';
                                break;
                            case 'kwd':
                                newPrice = (priceInUsd * defaultRates.KWD).toFixed(2) + 'د.ك';
                                break;
                            case 'qar':
                                newPrice = (priceInUsd * defaultRates.QAR).toFixed(2) + 'ر.ق';
                                break;
                            case 'bhd':
                                newPrice = (priceInUsd * defaultRates.BHD).toFixed(2) + 'د.ب';
                                break;
                            case 'omr':
                                newPrice = (priceInUsd * defaultRates.OMR).toFixed(2) + 'ر.ع';
                                break;
                            case 'yer':
                                newPrice = (priceInUsd * defaultRates.YER).toFixed(2) + 'ر.ي';
                                break;
                            case 'jod':
                                newPrice = (priceInUsd * defaultRates.JOD).toFixed(2) + 'د.أ';
                                break;
                            case 'iqd':
                                newPrice = (priceInUsd * defaultRates.IQD).toFixed(2) + 'د.ع';
                                break;
                            case 'lbp':
                                newPrice = (priceInUsd * defaultRates.LBP).toFixed(2) + 'ل.ل';
                                break;
                            case 'syp':
                                newPrice = (priceInUsd * defaultRates.SYP).toFixed(2) + 'ل.س';
                                break;
                            case 'egp':
                                newPrice = (priceInUsd * defaultRates.EGP).toFixed(2) + 'ج.م';
                                break;
                            case 'sdg':
                                newPrice = (priceInUsd * defaultRates.SDG).toFixed(2) + 'ج.س';
                                break;
                            case 'lyd':
                                newPrice = (priceInUsd * defaultRates.LYD).toFixed(2) + 'د.ل';
                                break;
                            case 'tnd':
                                newPrice = (priceInUsd * defaultRates.TND).toFixed(2) + 'د.ت';
                                break;
                            case 'dzd':
                                newPrice = (priceInUsd * defaultRates.DZD).toFixed(2) + 'د.ج';
                                break;
                            case 'mad':
                                newPrice = (priceInUsd * defaultRates.MAD).toFixed(2) + 'د.م';
                                break;
                            case 'mru':
                                newPrice = (priceInUsd * defaultRates.MRU).toFixed(2) + 'أ.م';
                                break;
                            case 'ils':
                                newPrice = (priceInUsd * defaultRates.ILS).toFixed(2) + '₪';
                                break;
                            case 'sos':
                                newPrice = (priceInUsd * defaultRates.SOS).toFixed(2) + 'ش.ص';
                                break;
                            case 'kmf':
                                newPrice = (priceInUsd * defaultRates.KMF).toFixed(2) + 'ف.ق';
                                break;
                            case 'djf':
                                newPrice = (priceInUsd * defaultRates.DJF).toFixed(2) + 'ف.ج';
                                break;
                            case 'usd':
                                newPrice = priceInUsd.toFixed(2) + '$';
                                break;
                            case 'eur':
                                newPrice = (priceInUsd * defaultRates.EUR).toFixed(2) + '€';
                                break;
                            case 'try':
                                newPrice = (priceInUsd * defaultRates.TRY).toFixed(2) + '₺';
                                break;
                            case 'sek':
                                newPrice = (priceInUsd * defaultRates.SEK).toFixed(2) + 'كر';
                                break;
                            default:
                                newPrice = priceSar.toFixed(2) + 'ر.س';
                                break; }} 
                        else { newPrice = 'مجاني'; }
    
                        priceElement.textContent = newPrice; }); }); }); })
        .catch(error => console.error('خطأ في جلب أسعار صرف العملات : ', error));

// المراجعات
function toggleReviewForm() {
    const f = document.getElementById('review-form');
    f.style.display = f.style.display === 'none' ? 'flex' : 'none'; }

let reviewsData = [];
let currentPage = 0;
let audioAdded = false;

function fetchReviews() {
    fetch('handling.php')
        .then(r => r.json())
        .then(data => {
        let arr = data.reviews.slice();

        arr = arr.filter((v, i, a) =>
            i === a.findIndex(t =>
                t.name === v.name &&
                t.review === v.review &&
                t.created_at === v.created_at ));

        if (!audioAdded) {
            arr.push({
                avatar: 'uploads/Moha.png',
                name: 'MOHA',
                rating: 5,
                review: '',
                isAudio: true,
                audioSrc: 'uploads/Moha.mp3',
                created_at: '2024/10/6' });
            audioAdded = true; }

        reviewsData = arr;

        document.getElementById('total-reviews').textContent = `عدد المراجعات : ${data.total}`;

        buildDots();
        showReview(0); }); }

function showReview(idx) {
    if (idx < 0) idx = reviewsData.length - 1;
    if (idx >= reviewsData.length) idx = 0;
    currentPage = idx;

    const r = reviewsData[idx];
    const card = document.getElementById('review-card');

    let inner = `
        <img src="${r.avatar||'uploads/default.png'}" class="avatar">
        <h3>${r.name}</h3>
        <div>${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}</div>`;
    if (r.isAudio) { inner += `<audio controls><source src="${r.audioSrc}" type="audio/mpeg">متصفحك لا يدعم تشغيل الصوت.</audio>`; } 
    else { inner += `<p>${r.review}</p>`; }
    inner += `<div class="review-date">- ${r.created_at}م</div>`;

    card.innerHTML = inner;
    updateDots(); }

document.getElementById('prev-btn').onclick = () => showReview(currentPage - 1);
document.getElementById('next-btn').onclick = () => showReview(currentPage + 1);

function buildDots() {
    const dots = document.getElementById('dots');
    dots.innerHTML = '';
    reviewsData.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'dot';
        d.onclick = () => showReview(i);
        dots.appendChild(d); }); }

function updateDots() { document.querySelectorAll('.dot').forEach((d, i) => { d.classList.toggle('active', i === currentPage); }); }

window.addEventListener('load', fetchReviews);

// دالة لإظهار إشعار
function showNotification(msg, isSuccess = true) {
    const n = document.getElementById('notification');
    n.textContent = msg;
    n.className = 'notification ' + (isSuccess ? 'success' : 'error');
    n.style.display = 'block';

    requestAnimationFrame(() => { n.style.opacity = '1'; });
    setTimeout(() => {
        n.style.opacity = '0';
        setTimeout(() => { n.style.display = 'none'; }, 500); }, 5000); }
  
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        fetch('handling.php', { method:'POST', body:fd })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
            showNotification('تم النشر بنجاح 😎!', true);
            fetchReviews();
            toggleReviewForm(); } 
            else {
            showNotification('حدث خطأ، حاول مرة ثانية ❌', false); }})
        .catch(() => { showNotification('فشل الاتصال بالخادم.', false); }); });

// الأسئلة
const toggles = document.querySelectorAll('.faq-toggle');

toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const answer = toggle.nextElementSibling;
        const icon = toggle.querySelector('i');

    if (answer.classList.contains('show')) {
        answer.classList.remove('show');
        icon.classList.add('fa-chevron-down');
        icon.classList.remove('fa-chevron-up'); } 
    else {
        answer.classList.add('show');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up'); } }); });

// خاصية إرسال رسائل البريد الالكتروني
function showToast(message, isSuccess) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = ''; 
    toast.classList.add(isSuccess ? 'success' : 'error', 'show');
  
    setTimeout(() => { toast.classList.remove('show'); }, 5000); }
  
function sendMail() {
    const params = {
        user_email: document.getElementById('user_email').value,
        user_name:  document.getElementById('user_name').value,
        user_msg:   document.getElementById('user_msg').value };
  
    emailjs.init('6CdPFJ5dngZ4t0ID2');
    emailjs.send('service_fbfyhsr', 'template_g4zcz1a', params)
        .then(res => { showToast('وصلت الرسالة ✅', true); })
        .catch(err => {
            console.error('EmailJS Error : ', err);
            showToast(' الرسالة ماوصلت ❌', false); }); }