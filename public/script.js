const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// URL backend API (sesuaikan jika port berbeda)
const API_URL = 'http://localhost:3000/api/chat';

// State untuk mencegah spam
let isLoading = false;

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage || isLoading) return;

    // Tampilkan pesan user
    appendMessage('user', userMessage);
    input.value = '';

    // Tampilkan indikator bot sedang mengetik
    showTypingIndicator();

    try {
        isLoading = true;

        // Kirim request ke backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        // Hapus indikator typing
        removeTypingIndicator();

        // Tampilkan response dari Gemini
        if (data.success) {
            appendMessage('bot', data.response);
        } else {
            appendMessage('bot', 'Maaf, terjadi kesalahan. Silakan coba lagi.');
            console.error('API Error:', data.error);
        }
    } catch (error) {
        // Hapus indikator typing
        removeTypingIndicator();
        
        // Tampilkan error koneksi
        appendMessage('bot', '❌ Gagal terhubung ke server. Pastikan backend berjalan di http://localhost:3000');
        console.error('Network Error:', error);
    } finally {
        isLoading = false;
    }
});

// Fungsi untuk menampilkan pesan
function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    
    // Buat konten dengan format yang lebih rapi
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    // Format teks: ubah newline jadi <br>
    let formattedText = text
        .replace(/\n/g, '<br>')                           // Newline jadi <br>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold** jadi <strong>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')             // *italic* jadi <em>
        .replace(/• /g, '• ');                            // Menjaga bullet points
    
    contentDiv.innerHTML = formattedText;
    
    msg.appendChild(contentDiv);
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk menampilkan indikator "bot sedang mengetik"
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot');
    typingDiv.id = 'typing-indicator';
    typingDiv.textContent = 'Gemini is typing... ✍️';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk menghapus indikator typing
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}