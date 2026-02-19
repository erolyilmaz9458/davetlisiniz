/* ============================================
   INVITATION PORTAL - GLOBAL FUNCTIONS & LOGIC
   ============================================ */

// Global Variables
const passwords = {
    'kemerhan': 'venue-kemerhan',
    'masal2026': 'venue-tanyildiz',
    'masal': 'venue-tanyildiz'
};

// 1. Navigation & Password Logic
window.checkPassword = function () {
    console.log('checkPassword function triggered');
    const passwordInput = document.getElementById('password-input');
    const errorMsg = document.getElementById('error-message');

    if (!passwordInput) {
        console.error('Password input element not found');
        return;
    }

    const input = passwordInput.value.trim().toLowerCase();
    console.log('Entered Password:', input);

    if (passwords[input]) {
        console.log('Password matched for venue:', passwords[input]);

        // Hide landing
        const landing = document.getElementById('landing-section');
        if (landing) landing.classList.add('hidden');

        // Hide all venues first
        const venueSections = document.querySelectorAll('.invitation-section');
        venueSections.forEach(sec => sec.classList.add('hidden'));

        // Show target venue
        const targetId = passwords[input];
        const target = document.getElementById(targetId);

        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active-section');
            console.log('Venue shown successfully');
        } else {
            console.error('Target venue element not found:', targetId);
            if (errorMsg) errorMsg.textContent = 'Mekan içeriği yüklenemedi.';
        }
    } else {
        console.log('Password match failed');
        if (errorMsg) {
            errorMsg.textContent = 'Hatalı şifre. Lütfen tekrar deneyiniz.';
            setTimeout(() => { errorMsg.textContent = ''; }, 3000);
        }
        passwordInput.classList.add('shake');
        setTimeout(() => passwordInput.classList.remove('shake'), 600);
    }
};

window.switchSubTab = function (subPageId, btn) {
    const parentSection = btn.closest('.invitation-section');
    if (!parentSection) return;

    const subPages = parentSection.querySelectorAll('.sub-page');
    subPages.forEach(p => p.classList.add('hidden'));

    const target = document.getElementById(subPageId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const navItems = parentSection.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
};

// 2. RSVP Logic
window.selectRSVP = function (card, status, statusInputId) {
    console.log('Seçilen durum:', status, 'Hedef ID:', statusInputId);
    const container = card.closest('.rsvp-choice-grid');
    if (!container) return;

    const cards = container.querySelectorAll('.rsvp-choice-card');
    cards.forEach(c => c.classList.remove('active'));

    card.classList.add('active');

    // Status inputunu güncelle
    const statusInput = document.getElementById(statusInputId);
    if (statusInput) statusInput.value = status;
};

window.triggerMailTo = function (fullName, venueName, coupleNames, status, count, note) {
    console.log('Yedek yöntem (Mailto) tetikleniyor...');
    const mailTo = 'erolyilmaz9458@gmail.com';
    const subject = encodeURIComponent(`Katılım Onayı: ${fullName} - ${venueName}`);
    let bodyContent = `Merhabalar,\n\n${venueName} için katılım durumum:\n\n`;
    bodyContent += `Gelin & Damat: ${coupleNames}\n`;
    bodyContent += `Ad Soyad: ${fullName}\n`;
    bodyContent += `Durum: ${status}\n`;
    bodyContent += `Kişi Sayısı: ${count}\n`;
    if (note && note.trim() !== '') bodyContent += `Notum: ${note}\n`;
    bodyContent += `\nTeşekkürler.`;

    const mailtoUrl = `mailto:${mailTo}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => document.body.removeChild(link), 100);
};

window.sendRSVP = function (btnContext, venueName, coupleNames, nameId, statusId, countId, noteId) {
    console.log('RSVP Gönderiliyor...');

    const nameEl = document.getElementById(nameId);
    const statusEl = document.getElementById(statusId);
    const countEl = document.getElementById(countId);
    const noteEl = document.getElementById(noteId);

    const fullName = nameEl ? nameEl.value.trim() : '';
    const rsvpStatus = statusEl ? statusEl.value : 'Belirtilmedi';
    const guestCount = countEl ? countEl.value : '1 Kişi';
    const note = noteEl ? noteEl.value.trim() : '';

    console.log('Veriler Alındı:', {
        couple: coupleNames,
        name: fullName,
        status: rsvpStatus,
        count: guestCount,
        note: note,
        location: venueName
    });

    // === AD SOYAD ZORUNLU KONTROL ===
    if (!fullName) {
        if (nameEl) {
            nameEl.style.borderColor = "#ff4d4d";
            nameEl.focus();

            const formContainer = nameEl.closest('.rsvp-form-container');
            let errorMsg = formContainer ? formContainer.querySelector('.rsvp-error-msg') : null;

            if (!errorMsg) {
                errorMsg = document.createElement('p');
                errorMsg.className = 'rsvp-error-msg';
                errorMsg.style.color = '#ff4d4d';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.marginTop = '5px';
                nameEl.parentNode.appendChild(errorMsg);
            }

            errorMsg.textContent = '⚠️ Ad Soyad alanı zorunludur. Lütfen doldurunuz.';

            setTimeout(() => {
                nameEl.style.borderColor = "";
                errorMsg.textContent = "";
            }, 4000);
        } else {
            alert('⚠️ Ad Soyad alanı zorunludur. Lütfen doldurunuz.');
        }
        return;
    }

    const originalBtnText = btnContext.textContent;
    btnContext.textContent = 'Gönderiliyor...';
    btnContext.disabled = true;

    // EmailJS Bilgileri
    const serviceId = 'erolyilmaz9458@gmail.com';
    const templateId = 'template_qvsqxnl';
    const publicKey = 'tH9y7PthJZStF4ua_';

    // === AD SOYAD HER YERDE OLMALI ===
    const combinedMessage = `📋 KATILIM BİLDİRİMİ\n━━━━━━━━━━━━━━━━━━━\nAd Soyad: ${fullName}\nGelin & Damat: ${coupleNames}\nMekan: ${venueName}\nKatılım Durumu: ${rsvpStatus}\nKişi Sayısı: ${guestCount}\nNot: ${note || '-'}`;

    const templateParams = {
        from_name: fullName,
        name: fullName,
        sender_name: fullName,
        couple_names: coupleNames,
        attendance_status: rsvpStatus,
        user_message: `Ad Soyad: ${fullName} | Katılım: ${rsvpStatus} | Kişi: ${guestCount} | Mekan: ${venueName} | Not: ${note || '-'}`,
        venue_name: venueName,
        guest_count: guestCount,
        message: combinedMessage,
        to_email: 'erolyilmaz9458@gmail.com',
        subject: `Katılım Bildirimi: ${fullName} - ${venueName}`,
        reply_to: 'noreply@adeldigital.com'
    };

    console.log('📧 Gönderilecek Veriler:', templateParams);

    if (typeof emailjs !== 'undefined') {
        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then(function () {
                console.log('✅ EmailJS Başarılı! Ad Soyad:', fullName);
                alert('✅ Yanıtınız başarıyla iletildi!\n\nAd Soyad: ' + fullName + '\nDurum: ' + rsvpStatus);

                // Formu Temizle
                if (nameEl) nameEl.value = '';
                if (noteEl) noteEl.value = '';

                btnContext.textContent = originalBtnText;
                btnContext.disabled = false;
            })
            .catch(function (error) {
                console.error('❌ EmailJS Hatası:', error);
                window.triggerMailTo(fullName, venueName, coupleNames, rsvpStatus, guestCount, note);
                btnContext.textContent = originalBtnText;
                btnContext.disabled = false;
            });
    } else {
        console.error('EmailJS SDK yüklü değil! Mailto yedek yöntemi kullanılıyor.');
        window.triggerMailTo(fullName, venueName, coupleNames, rsvpStatus, guestCount, note);
        btnContext.textContent = originalBtnText;
        btnContext.disabled = false;
    }
};


// 3. Other Interactions
window.filterGallery = function (category, btn) {
    const parentSection = btn.closest('.invitation-section');
    const items = parentSection.querySelectorAll('.gallery-item');
    const buttons = parentSection.querySelectorAll('.filter-btn');

    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    items.forEach(item => {
        if (category === 'Tümü' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};

window.openLightbox = function (item) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;

    const img = item.querySelector('img');
    if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};

window.addToCalendar = function (title, start, end, location) {
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent('Düğün davetiyesi: ' + title)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
};

// 4. Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Login Event Listeners
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    if (loginBtn) loginBtn.addEventListener('click', window.checkPassword);
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') window.checkPassword();
        });
    }

    // Countdown Logic
    const startCountdown = (targetDate, daysEl, hoursEl, minsEl, secsEl) => {
        const update = () => {
            const now = new Date();
            const diff = targetDate - now;
            if (diff <= 0) return;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minsEl) minsEl.textContent = mins;
            if (secsEl) secsEl.textContent = secs;
        };
        update();
        setInterval(update, 1000);
    };

    const venuesData = [{ id: 1, date: '2026-09-14T19:00:00' }, { id: 2, date: '2026-08-22T19:00:00' }];
    venuesData.forEach(venue => {
        startCountdown(
            new Date(venue.date),
            document.getElementById(`cd-days-${venue.id}`),
            document.getElementById(`cd-hours-${venue.id}`),
            document.getElementById(`cd-mins-${venue.id}`),
            document.getElementById(`cd-secs-${venue.id}`)
        );
    });
});
