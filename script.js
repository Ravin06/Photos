document.addEventListener("DOMContentLoaded", () => {
    const cardsContainer = document.getElementById("cardsContainer");
    const imageModal = document.getElementById("imageModal");
    const imageGallery = document.getElementById("imageGallery");
    const fullImageModal = document.getElementById("fullImageModal");
    const fullImage = document.getElementById("fullImage");
    const closeModalButtons = document.querySelectorAll(".close");
    let imageData = {};

    // Fetch images.json and generate only one card per category on the main page
    fetch("images.json")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load images.json");
            return response.json();
        })
        .then(data => {
            imageData = data;
            console.log("Loaded image data:", data); // Debugging output
            generateMainPageCards(data); // Generate main page cards for "Nature" and "Sports"
        })
        .catch(error => console.error("Error loading images:", error));

    // Generate only the main categories ("Nature" and "Sports") as cards on the main page
    function generateMainPageCards(data) {
        cardsContainer.innerHTML = ""; // Clear any existing content
        console.log("Generating cards for 'Nature' and 'Sports' categories");

        // List of categories to display as main cards
        const mainCategories = ['Nature', 'Sports'];

        // Loop through each category and create a card if it's "Nature" or "Sports"
        for (const [folderName, images] of Object.entries(data)) {
            console.log(`Processing category: ${folderName}, Images: ${images.length}`);

            if (!images || images.length === 0) continue; // Skip empty categories

            // If the category is "Nature" or "Sports", create a main card
            if (mainCategories.includes(folderName)) {
                const cardItem = document.createElement("li");
                cardItem.classList.add("cards_item");
                cardItem.setAttribute("data-folder", folderName);

                const card = document.createElement("div");
                card.classList.add("card");

                const cardImage = document.createElement("div");
                cardImage.classList.add("card_image");
                const img = document.createElement("img");
                img.src = images[0]; // Use the first image as a thumbnail for the category
                img.alt = `${folderName} category image`;
                cardImage.appendChild(img);

                const cardContent = document.createElement("div");
                cardContent.classList.add("card_content");
                const cardTitle = document.createElement("h2");
                cardTitle.classList.add("card_title");
                cardTitle.textContent = folderName;
                cardContent.appendChild(cardTitle);

                card.appendChild(cardImage);
                card.appendChild(cardContent);
                cardItem.appendChild(card);
                cardsContainer.appendChild(cardItem);

                console.log(`Created card for category: ${folderName}`); // Debugging output

                // Add event listener to open modal for the clicked category
                cardItem.addEventListener("click", () => {
                    openModal(folderName); // Open modal with images from the clicked category
                });
            }
        }

        console.log("Finished generating main category cards");
    }

    // Open modal and display images from all categories
    function openModal(folderName) {
        imageGallery.innerHTML = ""; // Clear the current modal content
        const images = imageData[folderName] || [];

        // Loop through and display images for the selected category in the modal
        images.forEach(imagePath => {
            const modalCard = document.createElement("div");
            modalCard.classList.add("modal_card");

            const modalCardImage = document.createElement("div");
            modalCardImage.classList.add("modal_card_image");
            const img = document.createElement("img");
            img.src = '.' + imagePath;
            img.alt = `${folderName} image`;
            modalCardImage.appendChild(img);
            modalCard.appendChild(modalCardImage);
            imageGallery.appendChild(modalCard);

            // Open full-size image on click
            modalCard.addEventListener("click", () => {
                fullImage.src = imagePath;
                fullImageModal.style.display = "block";
            });
        });

        // Also display images from other categories as smaller images in the modal
        Object.entries(imageData).forEach(([category, imagesInCategory]) => {
            if (category !== folderName) {
                imagesInCategory.forEach(imagePath => {
                    // Create a smaller image card for other categories
                    const modalCard = document.createElement("div");
                    modalCard.classList.add("modal_card");

                    const modalCardImage = document.createElement("div");
                    modalCardImage.classList.add("modal_card_image");
                    const img = document.createElement("img");
                    img.src = imagePath;
                    img.alt = `${category} image`;
                    modalCardImage.appendChild(img);
                    modalCard.appendChild(modalCardImage);
                    imageGallery.appendChild(modalCard);

                    // Open full-size image on click
                    modalCard.addEventListener("click", () => {
                        fullImage.src = imagePath;
                        fullImageModal.style.display = "block";
                    });
                });
            }
        });

        imageModal.style.display = "block"; // Show the modal with image cards
    }

    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            imageModal.style.display = "none";
            fullImageModal.style.display = "none";
        });
    });

    // Close full-size modal when clicking outside the image
    window.addEventListener("click", event => {
        if (event.target === fullImageModal) {
            fullImageModal.style.display = "none";
        }
        if (event.target === imageModal) {
            imageModal.style.display = "none";
        }
    });
});
