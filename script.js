const WHATSAPP_NUMBER = "213779724499";
const FORM = document.getElementById("orderForm");
const SUCCESS_MSG = document.getElementById("successMsg");
const sizeSelect = document.getElementById("size");
const quantityInput = document.getElementById("quantity");
const totalPriceEl = document.getElementById("totalPrice");

// دالة لحساب السعر الإجمالي
function updateTotal() {
    const pricePerUnit = parseInt(sizeSelect.value); // القيمة المخزنة في select هي السعر لكل وحدة
    const quantity = parseInt(quantityInput.value);
    const total = pricePerUnit * quantity;
    totalPriceEl.innerText = total;
}

// حدث عند تغيير الحجم أو الكمية
sizeSelect.addEventListener("change", updateTotal);
quantityInput.addEventListener("input", updateTotal);

// عند إرسال النموذج
FORM.addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const sizeText = sizeSelect.options[sizeSelect.selectedIndex].text;
    const quantity = quantityInput.value;
    const total = totalPriceEl.innerText;

    // إرسال الطلب مباشرة عبر واتساب
    const msg = `الاسم: ${name}%0Aالهاتف: ${phone}%0Aالعنوان: ${address}%0Aالحجم: ${sizeText}%0Aالكمية: ${quantity}%0Aالسعر الإجمالي: ${total} دج`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");

    SUCCESS_MSG.innerText = "تم إرسال طلبك عبر واتساب بنجاح!";

    FORM.reset();
    updateTotal(); // إعادة عرض السعر بعد إعادة تعيين النموذج
});

// حساب السعر الإجمالي عند تحميل الصفحة
updateTotal();

