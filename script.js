const adsList = document.getElementById("adsList");
const reloadButton = document.getElementById("reloadButton");
const adForm = document.getElementById("adForm");
const message = document.getElementById("message");

const API = "https://inai-col1.fishrungames.com";

async function getAds() {
    adsList.innerHTML = "<div class='loading'>LOADING ADS...</div>";

    try {
        const response = await fetch(API + "/ads");

        if (!response.ok) {
            throw new Error("Ошибка при получении объявлений");
        }

        const data = await response.json();

        adsList.innerHTML = "";

        if (data.items.length === 0) {
            adsList.innerHTML = "<div class='loading'>NO ADS FOUND</div>";
            return;
        }

        data.items.forEach(ad => {
            let image;

            if (ad.image_url) {
                image = `
                    <img
                        class="ad-image"
                        src="${API + ad.image_url}"
                        alt="${ad.title}"
                    >
                `;
            } else {
                image = `
                    <div class="ad-image no-image">
                        NO IMAGE
                    </div>
                `;
            }

            adsList.innerHTML += `
                <article class="ad-card">
                    ${image}
                    <div class="ad-id">AD / ${ad.id}</div>
                    <h3>${ad.title}</h3>
                    <p>${ad.description}</p>
                    <div class="ad-price">${ad.price} сом</div>
                </article>
            `;
        });

    } catch (error) {
        adsList.innerHTML = `
            <div class="loading">
                Не удалось загрузить объявления.
            </div>
        `;
        console.log(error);
    }
}

adForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").files[0];

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    if (image) {
        formData.append("image", image);
    }

    message.innerHTML = "PUBLISHING...";
    message.className = "";

    try {
        const response = await fetch(API + "/ads", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Ошибка при отправке объявления");
        }

        const data = await response.json();

        message.innerHTML =
            "✓ Объявление опубликовано. ID: " + data.id;
        message.className = "success";

        adForm.reset();

        getAds();

    } catch (error) {
        message.innerHTML =
            "✕ Не удалось отправить объявление.";
        message.className = "error";

        console.log(error);
    }
});

reloadButton.addEventListener("click", getAds);

getAds();
