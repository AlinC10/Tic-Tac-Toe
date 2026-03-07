export const imageController = (function () {
  let imageInputs, images, imageContainers, chooseImageContainers;

  const r = import.meta.webpackContext('../images/players-avatars', {
    recursive: false,
    regExp: /\.(avif)$/,
  });

  const importAllImg = (context) => context.keys().map(context);

  const avatarsArr = importAllImg(r);

  const numberOfRandomAvatars = 4;

  function initDOMVariables() {
    imageInputs = document.querySelectorAll('input[type="file"]');
    images = document.querySelectorAll('.image-container img');
    imageContainers = document.querySelectorAll('.image-container');
    chooseImageContainers = document.querySelectorAll('.choose-images');

    Array.from(imageInputs).forEach((input, index) => {
      const image = images[index];
      input.addEventListener('change', () => {
        const file = input.files[0];

        if (file) {
          const maxSizeInBytes = 2 * 1024 * 1024;

          if (file.size > maxSizeInBytes) {
            alert(
              'Image is bigger than 2MB! Choose an image with size below 2MB!',
            );

            input.value = '';
            image.src = '';

            return;
          }

          if (!file.type.startsWith('image')) {
            alert('Invalid File! Please use a image!');
            image.src = '';
            input.value = '';

            return;
          }

          const imageUrl = URL.createObjectURL(file);
          image.src = imageUrl;
          addDeleteImgBtn(image, index, input);
        } else image.src = '';
      });
    });
  }

  function addDeleteImgBtn(image, index, input = null) {
    const deleteImage = document.createElement('p');
    deleteImage.classList.add('delete-image');
    deleteImage.textContent = 'X';

    const chooseImgContainer = chooseImageContainers[index];
    chooseImgContainer.classList.add('hidden');

    const containerImg = imageContainers[index];
    containerImg.appendChild(deleteImage);
    deleteImage.addEventListener(
      'click',
      () => {
        chooseImgContainer.classList.remove('hidden');
        if (input) input.value = '';
        image.src = '';
        deleteImage.remove();
      },
      { once: true },
    );
  }

  function randomAvatar(img) {
    const randomNumber = Math.floor(Math.random() * numberOfRandomAvatars);
    const randomChosenAvatar = avatarsArr[randomNumber];
    img.src = randomChosenAvatar;
  }

  const randomAvatarBtn = document.querySelectorAll('.random-avatar');
  Array.from(randomAvatarBtn).forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      useRandomAvatar(index);
    });
  });

  function useRandomAvatar(index) {
    const image = images[index];
    // const container = imageContainers[index];
    randomAvatar(image);
    // const containerImg = imageContainers[index];
    // const chooseImgContainer = chooseImageContainers[index];
    addDeleteImgBtn(image, index);
  }

  function setPlayersAvatar(index) {
    const playerAvatar = images[index];
    const playerIngameAvatar =
      document.querySelectorAll('.ingame-avatar')[index];
    if (playerAvatar.getAttribute('src'))
      playerIngameAvatar.src = playerAvatar.src;
    else {
      useRandomAvatar(index);
      playerIngameAvatar.src = playerAvatar.src;
    }
  }

  return { setPlayersAvatar, initDOMVariables };
})();
