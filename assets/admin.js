document.addEventListener('DOMContentLoaded', () => {
    // Récupération du token d'authentification depuis le localStorage
    const token = localStorage.getItem('token');

    // Sélection de tous les éléments avec la classe 'js-admin'
    const admin = document.querySelectorAll('.js-admin');

    // Vérification de la présence du token
    if (token) {
        // Parcours de tous les éléments 'js-admin'
        admin.forEach((element) => {
            // Si l'élément a la classe 'hidden', on la retire, sinon on l'ajoute
            if (element.classList.contains('hidden')) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }

    // Sélection de l'élément de déconnexion
    const baliseLogout = document.getElementById('logout');

    // Ajout d'un écouteur d'événement pour la déconnexion
    baliseLogout.addEventListener('click', function () {
        // Suppression de toutes les données du localStorage et rechargement de la page
        localStorage.clear();
        location.reload();
    });

    // Fonction pour créer la modal principale
    function createModalMain() {
        const modal = document.createElement('aside');
        modal.id = 'modal-main';
        modal.className = 'modalMain modal hidden';
        modal.innerHTML = `
            <div class='modalWrapper'>
                <button class='cancelButton'>X</button>
                <h2 class='titleModal'>Galerie photo</h2>
                <div class='adminGallery'></div>
                <hr class='separator'>
                <input class='addPhotoButton' type='submit' value='Ajouter une photo' id='add-photo-button'>
            </div>`;

        return modal;
    }

    // Fonction pour créer la modal d'ajout de photo
    function createModalAddPhoto() {
        const modal = document.createElement('aside');
        modal.id = 'modal-add';
        modal.className = 'modalAdd modal hidden';
        modal.innerHTML = `
        <div class='modalWrapper'>
            <button class='fa-solid fa-arrow-left js-modal-back'></button>
            <button class='cancelButton'>X</button>
            <form class='addPhotoBox'>
                <h2 class='titleModal'>Ajout photo</h2>
                <section id='addPhotoFields'>
                    <div class='previewPhotoContainer'>
                        <div class='placeholderContainer'>
                            <img src='./assets/images/placeholder.svg' alt='placeholder'>
			                <label for='fileInput' class='addPhotoButton'>+ Ajouter photo
				                <input id='fileInput' class='hidden' type='file' name='fileInput' accept='.jpg,.jpeg,.png'/>
			                </label>
                            <p>jpg, png : 4mo max</p>
                        </div>
                        <img id='previewImage' class=' hidden addPhotoImg' />
                    </div>
                    <label for='title'>Titre</label>
                    <input type='text' name='titre' id='title'>
                    <label for='categorie'>Catégorie</label>
                    <select name='categorie' id='categorie'></select>
                </section>
                <hr class='separator'>
                <input class='validateButton' type='submit' value='Valider' id='submit' disabled>
            </form>
        </div>`;

        return modal;
    }

    // Sélection des éléments nécessaires pour la gestion des modals
    const modifiedButton = document.querySelector('#modified-Button');
    const modalContainer = document.querySelector('#modal-container');

    // Création des modals
    const modalMain = createModalMain();
    const modalAddPhoto = createModalAddPhoto();

    // Ajout des modals au conteneur
    modalContainer.appendChild(modalMain);
    modalContainer.appendChild(modalAddPhoto);

    // Ajout d'un écouteur d'événement pour ouvrir la modal principale
    modifiedButton.addEventListener('click', (event) => {
        event.preventDefault();
        modalMain.classList.remove('hidden');
    });

    // Ajout d'un écouteur d'événement pour fermer les modals en cliquant en dehors
    const modal = document.querySelectorAll('.modal');
    modal.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
                clearModal();
            }
        });
    });

    // Ajout d'un écouteur d'événement pour ouvrir la modal d'ajout de photo
    const addPhotoButton = modalMain.querySelector('#add-photo-button');
    addPhotoButton.addEventListener('click', (event) => {
        event.preventDefault();
        modalMain.classList.add('hidden');
        modalAddPhoto.classList.remove('hidden');
    });

    // Ajout d'un écouteur d'événement pour revenir à la modal principale
    const backButton = modalAddPhoto.querySelector('.js-modal-back');
    backButton.addEventListener('click', (event) => {
        event.preventDefault();
        modalAddPhoto.classList.add('hidden');
        modalMain.classList.remove('hidden');
    });

    // Ajout d'un écouteur d'événement pour fermer les modals
    const closeButton = document.querySelectorAll('.cancelButton');
    closeButton.forEach(button => {
        button.addEventListener('click', () => {
            modalMain.classList.add('hidden');
            modalAddPhoto.classList.add('hidden');
            clearModal();
        });
    });

    // Fonction pour afficher un message d'erreur
    function snackbarError(message) {
        const snackbar = document.createElement('div');
        snackbar.className = 'snackbar';
        snackbar.textContent = message;
        document.body.appendChild(snackbar);
        setTimeout(() => {
            document.body.removeChild(snackbar);
        }, 3000);
    }

    // Fonction pour afficher la galerie admin
    async function displayAdminGallery() {
        const portfolioItems = await getProject();
        const baliseAdminGallery = modalMain.querySelector('.adminGallery');

        baliseAdminGallery.innerHTML = ''
        portfolioItems.forEach((portfolioItem) => {
            const baliseFigure = document.createElement('figure');
            const baliseImg = document.createElement('img');
            const balisebin = document.createElement('i');

            baliseImg.src = portfolioItem.imageUrl;
            baliseImg.alt = portfolioItem.title;
            balisebin.classList.add('fa-solid', 'fa-trash-can');
            baliseFigure.dataset.id = portfolioItem.categoryId;
            baliseFigure.dataset.projectId = portfolioItem.id;

            baliseFigure.appendChild(baliseImg);
            baliseFigure.appendChild(balisebin);
            baliseAdminGallery.appendChild(baliseFigure);

            balisebin.addEventListener('click', function (event) {
                event.preventDefault()
                deleteProject(portfolioItem.id);
            });
        });
    }
    displayAdminGallery();

    // Fonction pour supprimer un projet
    async function deleteProject(projectId) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });

            if (!response.ok) {
                throw new Error('Une erreur est survenue')
            }
            displayProject()
            displayAdminGallery()
        } catch (error) {
            snackbarError('Une erreur est survenue lors de la suppression du projet, veuillez ressayer plus tard.');
        }
    }

    // Gestion de l'ajout de photo
    const fileInput = modalAddPhoto.querySelector('#fileInput');
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const maxSize = 4 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png'];
        const placeholderContainer = document.querySelector('.placeholderContainer');
        const previewImage = document.getElementById('previewImage');

        if (file) {
            if (!allowedTypes.includes(file.type)) {
                alert('Le type de fichier n\'est pas autorisé. Seuls les fichiers JPG et PNG sont acceptés.');
                event.target.value = '';
            } else if (file.size > maxSize) {
                alert('Le fichier est trop grand. La taille maximale autorisée est de 4 Mo.');
                event.target.value = '';
            } else {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
                placeholderContainer.classList.add('hidden');
                previewImage.classList.remove('hidden');
            }
        }
    });

    // Fonction pour afficher les catégories admin
    async function displayAdminCategories() {
        const categories = await getCategories();
        const baliseAdminCategories = modalAddPhoto.querySelector('#categorie');
        const option = document.createElement('option');
        baliseAdminCategories.appendChild(option);

        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            baliseAdminCategories.appendChild(option);
        });
    }
    displayAdminCategories();

    // Fonction pour vérifier les champs du formulaire
    function checkFields() {
        const validateButton = document.getElementById('submit');
        const photoField = document.getElementById('previewImage');
        const titleField = document.getElementById('title');
        const categorieField = document.getElementById('categorie');
        if (photoField.src !== '' && titleField.value !== '' && categorieField.value !== '') {
            validateButton.disabled = false;
        } else {
            validateButton.disabled = true;
        }
    }

    // Sélection des éléments du formulaire
    const validateButton = document.getElementById('submit');
    const photoField = document.getElementById('previewImage');
    const titleField = document.getElementById('title');
    const categorieField = document.getElementById('categorie');

    // Ajout d'écouteurs d'événements pour vérifier les champs du formulaire
    photoField.addEventListener('load', checkFields);
    titleField.addEventListener('input', checkFields);
    categorieField.addEventListener('change', checkFields);

    // Fonction pour ajouter un projet
    async function addProject() {
        const fileInput = modalAddPhoto.querySelector('#fileInput');
        const titleField = document.getElementById('title');
        const categorieField = document.getElementById('categorie');

        const formData = new FormData();
        formData.append('title', titleField.value);
        formData.append('category', categorieField.value);
        formData.append('image', fileInput.files[0]);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Une erreur est survenue')
            }
            displayProject()
            displayAdminGallery()
        } catch (error) {
            snackbarError('Une erreur est survenue lors de l\'ajout du projet, veuillez ressayer plus tard.');
        }
    }
    validateButton.addEventListener('click', function (event) {
        event.preventDefault()
        addProject();
        clearModal();
    });

    // Fonction pour réinitialiser les champs du formulaire
    async function clearModal() {
        const titleField = document.getElementById('title');
        if (titleField) {
            titleField.value = '';
        }

        const categorieField = document.getElementById('categorie');
        if (categorieField) {
            categorieField.selectedIndex = 0;
        }

        const placeholderContainer = document.querySelector('.placeholderContainer');
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            placeholderContainer.classList.remove('hidden');
            previewImage.classList.add('hidden');
        }
        checkFields();
    }
});
