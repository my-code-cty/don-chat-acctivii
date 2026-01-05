/* ===== Firebase config ===== */
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

/* ===== imgBB API KEY ===== */
const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY";

/* ===== Send message ===== */
function sendMessage() {
  const username = document.getElementById("username").value || "Ẩn danh";
  const message = document.getElementById("message").value;
  const imageFile = document.getElementById("imageInput").files[0];

  if (!message && !imageFile) return;

  if (imageFile) {
    uploadImage(imageFile, (imageUrl) => {
      saveMessage(username, message, imageUrl);
    });
  } else {
    saveMessage(username, message, "");
  }

  document.getElementById("message").value = "";
  document.getElementById("imageInput").value = "";
}

/* ===== Save to Firebase ===== */
function saveMessage(user, text, image) {
  database.ref("messages").push({
    user: user,
    text: text,
    image: image,
    time: Date.now()
  });
}

/* ===== Upload image to imgBB ===== */
function uploadImage(file, callback) {
  const formData = new FormData();
  formData.append("image", file);

  fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    callback(data.data.url);
  })
  .catch(err => alert("Upload ảnh lỗi"));
}

/* ===== Listen messages ===== */
database.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.className = "message";

  div.innerHTML = `<b>${data.user}</b>: ${data.text || ""}`;

  if (data.image) {
    const img = document.createElement("img");
    img.src = data.image;
    div.appendChild(img);
  }

  document.getElementById("messages").appendChild(div);
});
