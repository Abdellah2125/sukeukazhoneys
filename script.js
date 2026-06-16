// ========================================
// CONFIGURATION
// ========================================
const WHATSAPP_NUMBER = '213779724499';

// ========================================
// DOM ELEMENTS
// ========================================
const form = document.getElementById('orderForm');
const successMsg = document.getElementById('successMsg');
const sizeSelect = document.getElementById('sizeSelect');
const quantityInput = document.getElementById('quantityForm');
const quantityPricing = document.getElementById('quantity');
const totalPriceEl = document.getElementById('totalPriceForm');
const totalPricePricing = document.getElementById('totalPrice');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');
const addressInput = document.getElementById('address');
const addressError = document.getElementById('addressError');
const sizeButtons = document.querySelectorAll('.select-size');
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

// ========================================
// STATE
// ========================================
let selectedSize = '500غ';
let selectedPrice = 3000;

// ========================================
// PRICE CALCULATION
// ========================================
function updateTotal() {
    const price = parseInt(sizeSelect.value) || selectedPrice;
    const qty = Math.max(1, parseInt(quantityInput.value) || 1);
    const total = price * qty;
    const formatted = total.toLocaleString('ar-DZ');
    totalPriceEl.textContent = formatted;
    if (totalPricePricing) totalPricePricing.textContent = formatted;
}

// ========================================
// PHONE VALIDATION
// ========================================
function validatePhone() {
    const phone = phoneInput.value.trim();
    const pattern = /^0(5|6|7|9)\d{8}$/;

    if (phone && !pattern.test(phone)) {
        phoneError.textContent = '⚠️ رقم الهاتف غير صحيح. يجب أن يكون 10 أرقام ويبدأ بـ 05 أو 06 أو 07 أو 09';
        phoneInput.style.borderColor = '#e74c3c';
        return false;
    }

    phoneError.textContent = '';
    phoneInput.style.borderColor = '';
    return true;
}

// ========================================
// NAME VALIDATION
// ========================================
function validateName() {
    const name = nameInput.value.trim();
    if (!name) {
        nameError.textContent = '⚠️ الرجاء إدخال الاسم الكامل';
        nameInput.style.borderColor = '#e74c3c';
        return false;
    }
    if (name.length < 2) {
        nameError.textContent = '⚠️ الاسم يجب أن يتكون من حرفين على الأقل';
        nameInput.style.borderColor = '#e74c3c';
        return false;
    }
    nameError.textContent = '';
    nameInput.style.borderColor = '';
    return true;
}

// ========================================
// ADDRESS VALIDATION
// ========================================
function validateAddress() {
    const address = addressInput.value.trim();
    if (!address) {
        addressError.textContent = '⚠️ الرجاء إدخال العنوان';
        addressInput.style.borderColor = '#e74c3c';
        return false;
    }
    if (address.length < 5) {
        addressError.textContent = '⚠️ العنوان قصير جداً، أدخل عنواناً مفصلاً';
        addressInput.style.borderColor = '#e74c3c';
        return false;
    }
    addressError.textContent = '';
    addressInput.style.borderColor = '';
    return true;
}

// ========================================
// FORM VALIDATION
// ========================================
function validateForm() {
    const validName = validateName();
    const validPhone = validatePhone();
    const validAddress = validateAddress();
    return validName && validPhone && validAddress;
}

// ========================================
// SIZE SELECTION (from pricing cards)
// ========================================
sizeButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const price = parseInt(this.dataset.price);
        const size = this.dataset.size;

        selectedPrice = price;
        selectedSize = size;

        // تحديث select في النموذج
        const options = sizeSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value == price) {
                sizeSelect.selectedIndex = i;
                break;
            }
        }

        // تحديث السعر
        updateTotal();

        // تمرير إلى قسم الطلب
        document.getElementById('order').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    });
});

// ========================================
// FORM EVENTS
// ========================================
sizeSelect.addEventListener('change', updateTotal);
quantityInput.addEventListener('input', function () {
    if (quantityPricing) quantityPricing.value = this.value;
    updateTotal();
});
if (quantityPricing) {
    quantityPricing.addEventListener('input', function () {
        quantityInput.value = this.value;
        updateTotal();
    });
}

nameInput.addEventListener('blur', validateName);
nameInput.addEventListener('input', function () {
    if (this.value.trim().length >= 2) validateName();
});

addressInput.addEventListener('blur', validateAddress);
addressInput.addEventListener('input', function () {
    if (this.value.trim().length >= 5) validateAddress();
});

phoneInput.addEventListener('blur', validatePhone);
phoneInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
    if (this.value.length === 10) validatePhone();
});

// ========================================
// FORM SUBMISSION
// ========================================
form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    const sizeText = sizeSelect.options[sizeSelect.selectedIndex].text;
    const qty = quantityInput.value || 1;
    const total = (parseInt(sizeSelect.value) * parseInt(qty)).toLocaleString('ar-DZ');

    // بناء رسالة واتساب
    const message =
        '🍯 *طلب جديد – عسل السدر*\n\n' +
        `👤 الاسم: ${name}\n` +
        `📞 الهاتف: ${phone}\n` +
        `📍 العنوان: ${address}\n` +
        `📦 الحجم: ${sizeText}\n` +
        `🔢 الكمية: ${qty}\n` +
        `💰 الإجمالي: ${total} دج`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(url, '_blank');

    // رسالة نجاح
    successMsg.textContent = '✅ تم إرسال طلبك عبر واتساب بنجاح!';
    successMsg.style.color = '#1a7a40';
    successMsg.style.display = 'block';

    // إعادة تعيين النموذج
    // form.reset();
    // updateTotal();

    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 6000);
});

// ========================================
// MOBILE MENU
// ========================================
if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
        nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
}

// ========================================
// INIT
// ========================================
updateTotal();

