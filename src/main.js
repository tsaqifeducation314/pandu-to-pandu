import './style.css';

const form = document.querySelector('#messageForm');
const nameInput = document.querySelector('#senderName');
const cohortInput = document.querySelector('#cohort');
const messageInput = document.querySelector('#message');
const photoInput = document.querySelector('#photo');
const photoPreview = document.querySelector('#photoPreview');
const previewImage = document.querySelector('#previewImage');
const uploadTitle = document.querySelector('#uploadTitle');
const uploadZone = document.querySelector('#uploadZone');
const removePhotoButton = document.querySelector('#removePhoto');
const charCount = document.querySelector('#charCount');
const feedback = document.querySelector('#formFeedback');
const statusCard = document.querySelector('#statusCard');
const statusTitle = document.querySelector('#statusTitle');
const statusDescription = document.querySelector('#statusDescription');
const sendAnotherButton = document.querySelector('#sendAnother');
const archiveCount = document.querySelector('#archiveCount');
const archiveSection = document.querySelector('#archiveSection');
const archiveList = document.querySelector('#archiveList');
const archiveSummary = document.querySelector('#archiveSummary');
const emptyArchive = document.querySelector('#emptyArchive');
const searchArchive = document.querySelector('#searchArchive');
const toast = document.querySelector('#toast');

let selectedPhoto = '';
let toastTimer;

const STORAGE_KEY = 'digitalPanduMessages';

function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function setError(id, message) {
  document.querySelector(`#${id}`).textContent = message;
}

function clearErrors() {
  ['nameError', 'cohortError', 'messageError', 'photoError'].forEach((id) => setError(id, ''));
  [nameInput, cohortInput, messageInput].forEach((input) => input.classList.remove('invalid'));
}

function validateForm() {
  clearErrors();
  let valid = true;

  if (!nameInput.value.trim()) {
    setError('nameError', 'Nama pengirim wajib diisi.');
    nameInput.classList.add('invalid');
    valid = false;
  }
  if (!cohortInput.value.trim()) {
    setError('cohortError', 'Angkatan wajib diisi.');
    cohortInput.classList.add('invalid');
    valid = false;
  }
  if (!messageInput.value.trim()) {
    setError('messageError', 'Pesan kenangan wajib diisi.');
    messageInput.classList.add('invalid');
    valid = false;
  }
  if (photoInput.files[0] && photoInput.files[0].size > 5 * 1024 * 1024) {
    setError('photoError', 'Ukuran foto melebihi 5 MB. Pilih foto yang lebih kecil.');
    valid = false;
  }
  if (photoInput.files[0] && !['image/jpeg', 'image/png', 'image/webp'].includes(photoInput.files[0].type)) {
    setError('photoError', 'Gunakan format JPG, PNG, atau WEBP.');
    valid = false;
  }
  return valid;
}

function updateCounts() {
  charCount.textContent = `${messageInput.value.length}/500`;
  archiveCount.textContent = getMessages().length;
}

function resetForm() {
  form.reset();
  selectedPhoto = '';
  previewImage.removeAttribute('src');
  photoPreview.hidden = true;
  uploadZone.classList.remove('has-photo');
  uploadTitle.textContent = 'Klik untuk mengunggah foto';
  feedback.textContent = '';
  updateCounts();
  clearErrors();
}

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  setError('photoError', '');
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    setError('photoError', 'Ukuran foto melebihi 5 MB. Pilih foto yang lebih kecil.');
    photoInput.value = '';
    return;
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    setError('photoError', 'Gunakan format JPG, PNG, atau WEBP.');
    photoInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    selectedPhoto = reader.result;
    previewImage.src = selectedPhoto;
    photoPreview.hidden = false;
    uploadZone.classList.add('has-photo');
    uploadTitle.textContent = file.name;
  };
  reader.readAsDataURL(file);
});

removePhotoButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  photoInput.value = '';
  selectedPhoto = '';
  previewImage.removeAttribute('src');
  photoPreview.hidden = true;
  uploadZone.classList.remove('has-photo');
  uploadTitle.textContent = 'Klik untuk mengunggah foto';
  setError('photoError', '');
});

messageInput.addEventListener('input', updateCounts);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  feedback.textContent = '';
  if (!validateForm()) {
    feedback.textContent = 'Periksa kembali kolom yang wajib diisi.';
    feedback.classList.add('error-text');
    const firstInvalid = form.querySelector('.invalid');
    firstInvalid?.focus();
    return;
  }

  const messages = getMessages();
  const newMessage = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: nameInput.value.trim(),
    cohort: cohortInput.value.trim(),
    message: messageInput.value.trim(),
    photo: selectedPhoto,
    createdAt: new Date().toISOString()
  };

  try {
    messages.unshift(newMessage);
    saveMessages(messages);
  } catch {
    feedback.textContent = 'Penyimpanan lokal penuh. Coba kirim tanpa foto atau gunakan foto berukuran lebih kecil.';
    feedback.classList.add('error-text');
    return;
  }

  statusCard.classList.add('success-state');
  statusTitle.textContent = 'Pesan Terkirim!';
  statusDescription.textContent = 'Terima kasih telah berbagi kenangan. Pesanmu sudah tersimpan di browser ini dan bisa dilihat di arsip.';
  sendAnotherButton.hidden = false;
  updateCounts();
  resetForm();
  feedback.textContent = 'Pesan berhasil disimpan!';
  feedback.classList.remove('error-text');
  showToast('Pesan berhasil disimpan di perangkat ini.');
  renderArchive();
});

sendAnotherButton.addEventListener('click', () => {
  statusCard.classList.remove('success-state');
  statusTitle.textContent = 'Satu pesan, satu kenangan.';
  statusDescription.textContent = 'Ceritamu ikut membentuk perjalanan Pramuka kita. Tinggalkan pesan yang ingin kamu kenang bersama.';
  sendAnotherButton.hidden = true;
  document.querySelector('#kirim').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function formatDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
}

function renderArchive() {
  const query = searchArchive.value.trim().toLocaleLowerCase('id-ID');
  const allMessages = getMessages();
  const messages = allMessages.filter((item) =>
    `${item.name} ${item.cohort} ${item.message}`.toLocaleLowerCase('id-ID').includes(query)
  );

  archiveCount.textContent = allMessages.length;
  archiveSummary.textContent = `${messages.length} dari ${allMessages.length} pesan`;
  archiveList.replaceChildren();
  emptyArchive.hidden = messages.length > 0;
  if (allMessages.length === 0) emptyArchive.textContent = 'Belum ada pesan tersimpan. Jadilah yang pertama meninggalkan kenangan!';
  else if (messages.length === 0) emptyArchive.textContent = 'Tidak ada pesan yang cocok dengan pencarianmu.';

  messages.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'archive-card';
    const meta = document.createElement('div');
    meta.className = 'archive-meta';
    const name = document.createElement('strong');
    name.textContent = item.name;
    const cohort = document.createElement('span');
    cohort.textContent = item.cohort;
    const date = document.createElement('time');
    date.textContent = formatDate(item.createdAt);
    date.dateTime = item.createdAt;
    meta.append(name, cohort, date);
    const body = document.createElement('p');
    body.textContent = item.message;
    card.append(meta, body);
    if (item.photo) {
      const image = document.createElement('img');
      image.className = 'archive-photo';
      image.src = item.photo;
      image.alt = `Foto kenangan dari ${item.name}`;
      card.append(image);
    }
    archiveList.append(card);
  });
}

function openArchive() {
  archiveSection.hidden = false;
  document.querySelector('.page-grid').hidden = true;
  renderArchive();
  archiveSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function closeArchive() {
  archiveSection.hidden = true;
  document.querySelector('.page-grid').hidden = false;
  document.querySelector('#kirim').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelector('#archiveNav').addEventListener('click', openArchive);
document.querySelector('#viewArchive').addEventListener('click', openArchive);
document.querySelector('#backToForm').addEventListener('click', closeArchive);
searchArchive.addEventListener('input', renderArchive);

updateCounts();
renderArchive();
