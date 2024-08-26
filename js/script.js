document.getElementById('create-new-btn').addEventListener('click', createNewTopGrid);
document.getElementById('add-category-btn').addEventListener('click', addCategory);
document.getElementById('finish-btn').addEventListener('click', finishAndSave);
document.getElementById('back-to-home-btn').addEventListener('click', goToHomeScreen);
document.getElementById('edit-btn').addEventListener('click', editCurrentTopGrid);

let topGrids = JSON.parse(localStorage.getItem('topGrids')) || [];
let currentTopGridIndex = null;


function loadTopGrids() {
    const topGridsList = document.getElementById('topgrids-list');
    topGridsList.innerHTML = '';
    topGrids.forEach((topGrid, index) => {
        const topGridItem = document.createElement('div');
        topGridItem.className = 'topgrid-item';

        // Create a preview container for images
        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';

        // Loop through the first few categories to show their images
        topGrid.categories.slice(0, 3).forEach(category => {
            if (category.imageUrl) {
                const previewImage = document.createElement('img');
                previewImage.src = category.imageUrl;
                previewImage.className = 'preview-image';
                previewContainer.appendChild(previewImage);
            }
        });

        // If no images were added, show a placeholder
        if (previewContainer.children.length === 0) {
            const placeholderImage = document.createElement('img');
            placeholderImage.src = 'assets/placeholder.png'; // Fallback image if no image exists
            placeholderImage.className = 'preview-image';
            previewContainer.appendChild(placeholderImage);
        }

        topGridItem.appendChild(previewContainer);

        // Create a title element
        const titleElement = document.createElement('div');
        titleElement.textContent = topGrid.title;
        topGridItem.appendChild(titleElement);

        topGridItem.addEventListener('click', () => viewTopGrid(index));
        topGridsList.appendChild(topGridItem);
    });
}

document.getElementById('share-btn').addEventListener('click', shareTopGrid);

function shareTopGrid() {
    if (currentTopGridIndex === null) return;

    const topGrid = topGrids[currentTopGridIndex];
    const topGridData = encodeURIComponent(JSON.stringify(topGrid));
    const shareableLink = `${window.location.origin}${window.location.pathname}?topgrid=${topGridData}`;

    // Copy the link to the clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Shareable link copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy link: ' + err);
    });
}

function createNewTopGrid() {
    // Reset the editor screen for a new TopGrid
    currentTopGridIndex = null;
    document.getElementById('topgrid-title').value = '';
    document.getElementById('categories').innerHTML = '';
    document.getElementById('editor-screen').classList.remove('hidden');
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('grid-container').classList.add('hidden');
}

function addCategory() {
    const categoriesDiv = document.getElementById('categories');
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';

    const categoryNameInput = document.createElement('input');
    categoryNameInput.type = 'text';
    categoryNameInput.placeholder = 'Enter category name';
    categoryDiv.appendChild(categoryNameInput);

    const choiceNameInput = document.createElement('input');
    choiceNameInput.type = 'text';
    choiceNameInput.placeholder = 'Enter your choice';
    categoryDiv.appendChild(choiceNameInput);

    const imageUrlInput = document.createElement('input');
    imageUrlInput.type = 'text';
    imageUrlInput.placeholder = 'Enter image URL';
    categoryDiv.appendChild(imageUrlInput);

    categoriesDiv.appendChild(categoryDiv);
}

function finishAndSave() {
  const topGridTitle = document.getElementById('topgrid-title').value.trim();
    if (topGridTitle === '') {
        alert('TopGrid title cannot be empty.');
        return;
    }

    const categories = Array.from(document.querySelectorAll('.category')).map(category => {
        const categoryName = category.querySelector('input[type=text]:nth-child(1)').value.trim();
        const choiceName = category.querySelector('input[type=text]:nth-child(2)').value.trim();
        const imageUrl = category.querySelector('input[type=text]:nth-child(3)').value.trim();

        // Check if any category or choice fields are empty
        if (categoryName === '' || choiceName === '' || imageUrl === '') {
            alert('All fields must be filled out in each category.');
            return null; // Return null to indicate validation failure
        }

        return {
            categoryName: categoryName,
            choiceName: choiceName,
            imageUrl: imageUrl
        };
    });

    // If the categories array contains null, it means validation failed
    if (categories.includes(null)) {
        return;
    }

    const newTopGrid = { title: topGridTitle, categories: categories };

    // Check for duplicate title
    const existingIndex = topGrids.findIndex(grid => grid.title === topGridTitle);
    if (existingIndex !== -1 && existingIndex !== currentTopGridIndex) {
        alert('A TopGrid with this title already exists. Please choose a different title.');
        return;
    }

    if (currentTopGridIndex === null) {
        topGrids.push(newTopGrid);
    } else {
        topGrids[currentTopGridIndex] = newTopGrid;
    }

    localStorage.setItem('topGrids', JSON.stringify(topGrids));
    displayTopGrid(newTopGrid);
}

function displayTopGrid(topGrid) {
    document.getElementById('grid-title').textContent = topGrid.title;
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    topGrid.categories.forEach(category => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category.categoryName;
        gridItem.appendChild(categoryTitle);

        const img = document.createElement('img');
        img.src = category.imageUrl;
        gridItem.appendChild(img);

        const choiceTitle = document.createElement('h3');
        choiceTitle.textContent = category.choiceName;
        gridItem.appendChild(choiceTitle);

        grid.appendChild(gridItem);
    });

    document.getElementById('editor-screen').classList.add('hidden');
    document.getElementById('grid-container').classList.remove('hidden');
    document.getElementById('home-screen').classList.add('hidden');
}

function viewTopGrid(index) {
    currentTopGridIndex = index;
    const topGrid = topGrids[index];
    displayTopGrid(topGrid);
}

function editCurrentTopGrid() {
    if (currentTopGridIndex === null) return;

    const topGrid = topGrids[currentTopGridIndex];
    document.getElementById('topgrid-title').value = topGrid.title;
    const categoriesDiv = document.getElementById('categories');
    categoriesDiv.innerHTML = '';
    topGrid.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const categoryNameInput = document.createElement('input');
        categoryNameInput.type = 'text';
        categoryNameInput.value = category.categoryName;
        categoryDiv.appendChild(categoryNameInput);

        const choiceNameInput = document.createElement('input');
        choiceNameInput.type = 'text';
        choiceNameInput.value = category.choiceName;
        categoryDiv.appendChild(choiceNameInput);

        const imageUrlInput = document.createElement('input');
        imageUrlInput.type = 'text';
        imageUrlInput.value = category.imageUrl;
        categoryDiv.appendChild(imageUrlInput);

        categoriesDiv.appendChild(categoryDiv);
    });

    document.getElementById('editor-screen').classList.remove('hidden');
    document.getElementById('grid-container').classList.add('hidden');
    document.getElementById('home-screen').classList.add('hidden');
}

function goToHomeScreen() {
    document.getElementById('grid-container').classList.add('hidden');
    document.getElementById('editor-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
    loadTopGrids();
}

document.getElementById('export-btn').addEventListener('click', exportAsJPG);

function exportAsJPG() {
      const element = document.getElementById('grid-container');

    html2canvas(element, {
        useCORS: true
    }).then(function(canvas) {
        canvas.toBlob(function(blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'topgrid.png';
            link.click();
        });
    }).catch(function(error) {
        console.error('Error capturing the image:', error);
    });
}

function checkForSharedTopGrid() {
    const urlParams = new URLSearchParams(window.location.search);
    const topGridData = urlParams.get('topgrid');

    if (topGridData) {
        const newTopGrid = JSON.parse(decodeURIComponent(topGridData));

        // Check if a TopGrid with the same title already exists
        const existingIndex = topGrids.findIndex(grid => grid.title === newTopGrid.title);
        if (existingIndex !== -1) {
            alert('You already have a TopGrid with this title.');
            return;
        }

        // Add the shared TopGrid to the user's list
        topGrids.push(newTopGrid);
        localStorage.setItem('topGrids', JSON.stringify(topGrids));
        alert('TopGrid added to your collection!');
        loadTopGrids();
    }
}

window.onload = function() {
    loadTopGrids();
    checkForSharedTopGrid(); // Check if there's a shared TopGrid to load
}

