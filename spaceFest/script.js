function updateCounter() {
  const counter = document.getElementById("counter");
  const users = JSON.parse(localStorage.getItem("participants") || "[]");
  counter.innerHTML = `Şu ana kadar <strong>${users.length}</strong> kişi katıldı!`;
}
function toggleMusic() {
  const audio = document.getElementById("bgMusic");
  audio.paused ? audio.play() : audio.pause();
}

window.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminalBox");
  const satirlar = [
    "Mars Fest Shuttle Program başlatılıyor...",
    "Katılımcı veri tabanı taranıyor...",
    "Çekiliş modülü yüklendi ✅"
  ];

  let index = 0;

  function kelimeYaz(satir, element, kelimeler, i = 0) {
    if (i < kelimeler.length) {
      element.textContent += kelimeler[i] + " ";
      setTimeout(() => kelimeYaz(satir, element, kelimeler, i + 1), 700); // kelime arası hız
    } else {
      index++;
      if (index < satirlar.length) {
        setTimeout(() => yazSatir(), 900); // sonraki satıra geçmeden bekleme
      } else {
        // tüm satırlar bittiğinde sıfırla
        setTimeout(() => {
          terminal.innerHTML = "";
          index = 0;
          yazSatir();
        }, 2000);
      }
    }
  }

  function yazSatir() {
    const yeniSatir = document.createElement("p");
    terminal.appendChild(yeniSatir);

    const kelimeler = satirlar[index].split(" ");
    kelimeYaz(satirlar[index], yeniSatir, kelimeler);
  }

  yazSatir();
});


window.addEventListener("DOMContentLoaded", () => {
  const counterEl = document.getElementById("counter").querySelector("strong");

  // Sayacı localStorage'tan al ya da 4800 ile başlat
  let hedef = parseInt(localStorage.getItem("katilimSayisi")) || 1679;

  // Her sayfa yenilemede 2–3 rastgele kişi ekle
  const yeniKatilim = Math.floor(Math.random() * 2) + 2; // 2 veya 3
  hedef += yeniKatilim;

  // Güncellenmiş hedefi sakla
  localStorage.setItem("katilimSayisi", hedef);

  // Sayımı başlat
  let current = 0;

  function sayacArtir() {
    if (current < hedef) {
      current++;
      counterEl.textContent = current.toLocaleString();

      // Son 50 sayıda yavaşlat
      const kalan = hedef - current;
      let hiz = 5;
      if (kalan < 20) {
        hiz = 200;
      } else if (kalan < 20) {
        hiz = 200;
      } else if (kalan < 20) {
        hiz = 200;
      }

      setTimeout(sayacArtir, hiz);
    }
  }

  sayacArtir();
});
document.getElementById("raffleForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const ship = document.querySelector('input[name="ship"]:checked')?.value;
  const messageBox = document.getElementById("message");

  if (!name || !email || !ship) {
    messageBox.textContent = "Lütfen tüm alanları doldurun!";
    messageBox.style.color = "#ff5555";
    return;
  }

  // Katılımcı listesi kontrolü
  let participants = JSON.parse(localStorage.getItem("participants") || "[]");

  const dahaOnceKatilmisMi = participants.some(p => p.email === email);

  if (dahaOnceKatilmisMi) {
    messageBox.textContent = "Bu e-posta ile zaten çekilişe katıldınız!";
    messageBox.style.color = "#ffaa00";
    return;
  }

  // Yeni katılımcıyı kaydet
  participants.push({ name, email, ship });
  localStorage.setItem("participants", JSON.stringify(participants));

  messageBox.textContent = "Çekilişe başarıyla katıldınız! 🚀";
  messageBox.style.color = "#00ffcc";

  // Formu isteğe bağlı sıfırla
  document.getElementById("raffleForm").reset();
});

const sayac = document.getElementById("counter").querySelector("strong");
sayac.textContent = participants.length.toLocaleString();


document.getElementById("drawBtn").addEventListener("click", function () {
  const winnersList = document.getElementById("winnersList");
  winnersList.innerHTML = "";

  // Daha önce çekiliş yapıldıysa, localStorage'tan kazananları getir
  const oncekiKazananlar = JSON.parse(localStorage.getItem("kazananlar"));

  if (oncekiKazananlar) {
    winnersList.innerHTML = "<li>Çekiliş daha önce yapılmıştı. Sonuçlar:</li>";
    oncekiKazananlar.forEach(kisi => {
      const li = document.createElement("li");
      li.textContent = kisi;
      li.style.color = kisi.includes("VIP") ? "#ff00ff" : "#00ffff";
      winnersList.appendChild(li);
    });
    return;
  }

  // Katılımcı verisi alınır
  let participants = JSON.parse(localStorage.getItem("participants") || "[]");

  if (participants.length < 3) {
    winnersList.innerHTML = "<li>Yeterli katılımcı yok!</li>";
    return;
  }

  const shuffled = [...participants].sort(() => 0.5 - Math.random());

  const vipWinner = shuffled.find(p => p.ship === "VIP Araç");
  const ekonomikWinners = shuffled.filter(p => p.ship === "Ekonomik Araç").slice(0, 2);

  const kazananMetinleri = [];

  if (vipWinner) {
    kazananMetinleri.push(`👑 VIP Kazanan: ${vipWinner.name} (${vipWinner.email})`);
  } else {
    kazananMetinleri.push("VIP araç seçen kimse yoktu.");
  }

  if (ekonomikWinners.length > 0) {
    ekonomikWinners.forEach((p, i) => {
      kazananMetinleri.push(`🚀 Ekonomik Kazanan ${i + 1}: ${p.name} (${p.email})`);
    });
  } else {
    kazananMetinleri.push("Ekonomik araç seçen kimse yoktu.");
  }

  // Sonuçları göster
  kazananMetinleri.forEach(kisi => {
    const li = document.createElement("li");
    li.textContent = kisi;
    li.style.color = kisi.includes("VIP") ? "#ff00ff" : "#00ffff";
    winnersList.appendChild(li);
  });

  // Kazananları sakla
  localStorage.setItem("kazananlar", JSON.stringify(kazananMetinleri));
});

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function vipSatinAl() {
  const name = document.getElementById("vipName").value.trim();
  const email = document.getElementById("vipEmail").value.trim();
  const dob = document.getElementById("vipDOB").value;

  if (!name || !email || !dob) {
    alert("Lütfen tüm bilgileri doldurun.");
    return;
  }

  const age = calculateAge(dob);
  if (age < 18) {
    alert("18 yaşın altındakiler için ebeveyn onayı gerekmektedir.");
    return;
  }

  alert(`${name}, Ödeme için gerekli bilgiler mail adresinize gönderilmiştir, iyi eğlenceler dileriz!\n(E-posta: ${email})`);
}

function ekoSatinAl() {
  const name = document.getElementById("ekoName").value.trim();
  const email = document.getElementById("ekoEmail").value.trim();
  const dob = document.getElementById("ekoDOB").value;

  if (!name || !email || !dob) {
    alert("Lütfen tüm bilgileri doldurun.");
    return;
  }

  const age = calculateAge(dob);
  if (age < 18) {
    alert("18 yaşın altındakiler için ebeveyn onayı gerekmektedir.");
    return;
  }

  alert(`${name}, Ödeme için gerekli bilgiler mail adresinize gönderilmiştir, iyi eğlenceler dileriz!.\n(E-posta: ${email})`);
}

function ucretsizKatil() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const emailWarning = document.getElementById("emailWarning");

  if (!name || !email) {
    alert("Lütfen adınızı ve e-posta adresinizi girin.");
    return;
  }

  const participants = JSON.parse(localStorage.getItem("participants") || "[]");

  // Aynı e-posta varsa uyar
  if (participants.some(p => p.email === email)) {
    emailWarning.style.display = "block";
    return;
  }

  // Katılımcıyı kaydet (sadece VIP)
  participants.push({
    name: name,
    email: email,
    status: "Aktif"
  });

  localStorage.setItem("participants", JSON.stringify(participants));
  emailWarning.style.display = "none";
  alert("Ücretsiz olarak çekilişe katıldınız! Bol şans!");
}


