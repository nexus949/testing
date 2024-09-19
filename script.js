document.addEventListener('DOMContentLoaded', () => {

    let closedMenu = document.querySelector('.fa-bars');
    let openMenu = document.querySelector('.fa-xmark');
    let sideNavBar = document.querySelector('.navBarforSmallerScreens');
    let navLinks = document.querySelectorAll('.navEl');

    closedMenu.addEventListener('click', () => {
        closedMenu.style.display = 'none';
        openMenu.style.display = 'inline-block';

        let sideMenu = document.createElement('div');
        sideMenu.classList.add('sideMenu');
        sideNavBar.append(sideMenu);

        navLinks.forEach(link => {

            // Remove right margin from nav links when in smaller screens
            link.style.marginRight = 0;

            link.classList.add('navLinkForSmallerScreens');
            sideMenu.appendChild(link);
        });

        // Activate the side menu with a smooth transition
        setTimeout(() => {
            sideMenu.classList.add('active');
        }, 10);
    });

    openMenu.addEventListener('click', () => {
        openMenu.style.display = 'none';
        closedMenu.style.display = 'inline-block';

        let sideMenu = document.querySelector('.sideMenu');
        if (sideMenu) {
            // Remove the active class for the smooth closing transition
            sideMenu.classList.remove('active');

            //return the navLinks to the origin navLink container (navOptions)
            setTimeout(() => {
                let navOptions = document.querySelector('.navOptions');
                navLinks.forEach(link => {
                    link.classList.remove('navLinkForSmallerScreens');

                    //reapply the margin to the right !
                    link.style.marginRight = '40px';
                    navOptions.appendChild(link);
                });
            }, 300);

            //remove the sideMenu
            setTimeout(() => {
                sideMenu.remove();
            }, 300)
        }
    });


    //darkmode code
    let darkModeButton = document.querySelector('.profilePicture');
    let currentMode = 'light';

    darkModeButton.addEventListener('click', () =>{
        if(currentMode === 'light'){
            darkModeButton.src = './gokuDark.jpg';
            currentMode = 'dark';
        }
        else{
            darkModeButton.src = './gokuLight.jpg';
            currentMode = 'light';
        }

        document.body.classList.toggle('dark-mode');
    });
});