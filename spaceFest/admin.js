window.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#participantTable tbody");

  // Katılımcı verileri localStorage'dan alınıyor
  const participants = JSON.parse(localStorage.getItem("participants") || "[]");

  // Tabloyu temizle (çift giriş olmasın)
  tableBody.innerHTML = "";

  participants.forEach((participant, index) => {
    // Her satır
    const row = document.createElement("tr");

    // İsim
    const nameCell = document.createElement("td");
    nameCell.textContent = participant.name;
    row.appendChild(nameCell);

    // E-posta
    const emailCell = document.createElement("td");
    emailCell.textContent = participant.email;
    row.appendChild(emailCell);

    // Durum (dropdown)
    const statusCell = document.createElement("td");
    const select = document.createElement("select");
    ["Aktif", "Kazandı", "Diskalifiye"].forEach(optionText => {
      const option = document.createElement("option");
      option.value = optionText;
      option.textContent = optionText;
      if (participant.status === optionText) option.selected = true;
      select.appendChild(option);
    });
    statusCell.appendChild(select);
    row.appendChild(statusCell);

  
    const updateCell = document.createElement("td");
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Kaydet";
    saveBtn.classList.add("btc-btn");

 
   saveBtn.addEventListener("click", () => {
  const newStatus = select.value;
  participants[index].status = newStatus;
  localStorage.setItem("participants", JSON.stringify(participants));
  statusText.textContent = newStatus; 

    if (newStatus === "Kazandı") {
    statusText.style.color = "#00ff99";  // yeşil
  } else if (newStatus === "Aktif") {
    statusText.style.color = "#ffcc00";  // turuncu
  } else if (newStatus === "Diskalifiye") {
    statusText.style.color = "#ff4444";  // kırmızı
  } else {
    statusText.style.color = "#ffffff";  // varsayılan
  }
  
  alert("Durum başarıyla güncellendi!");
});

    updateCell.appendChild(saveBtn);
    row.appendChild(updateCell);

// Durum Hücresi
const statusTextCell = document.createElement("td");
const statusText = document.createElement("span");
statusText.textContent = participant.status || "-";
statusText.style.color = "#fff";
statusTextCell.appendChild(statusText);
row.appendChild(statusTextCell);


    tableBody.appendChild(row);
  });
});


document.getElementById("drawBtn").addEventListener("click", () => {
  const participants = JSON.parse(localStorage.getItem("participants") || "[]");

  // 🔍 Sadece Aktif olan katılımcılar
  const vipParticipants = participants.filter(p => p.status === "Aktif");

  if (vipParticipants.length < 3) {
    alert("Yeterli sayıda katılımcı yok.");
    return;
  }

  // 🎯 Rastgele 3 kazanan seç
  const winners = [];
  while (winners.length < 3) {
    const index = Math.floor(Math.random() * vipParticipants.length);
    const winner = vipParticipants[index];
    if (!winners.includes(winner)) {
      winners.push(winner);
    }
  }

  // 📝 Kazananları ekrana yaz
  const winnersList = document.getElementById("winnersList");
  winnersList.innerHTML = "";

  winners.forEach(winner => {
    const li = document.createElement("li");
    li.textContent = `${winner.name} (${winner.email})`;
    winnersList.appendChild(li);
  });

  // 🏷️ Kazananların durumunu güncelle
  participants.forEach(p => {
    if (winners.find(w => w.email === p.email)) {
      p.status = "Kazandı";
    }
  });

  localStorage.setItem("participants", JSON.stringify(participants));

  // Sayfayı yenile ki güncellenmiş durumlar tabloya yansısın
  // location.reload();
});
