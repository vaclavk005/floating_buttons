class FloatingButtons extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const MAIN_BUTTON_SIZE = 70; // Size of the main button
        const BUTTON_SIZE = 60; // Size of the vertical and horizontal buttons
        const GAP = 10; // Gap between buttons
        const SPACING = BUTTON_SIZE + GAP; // Spacing between buttons
        const VERTICAL_OFFSET = (MAIN_BUTTON_SIZE - BUTTON_SIZE) / 2; // Offset for vertical buttons - center alignment
        // const VERTICAL_OFFSET = 0; // Offset for vertical buttons - right alignment
        const RIGHT_OFFSET = 20; // Offset from right edge of the screen
        const BOTTOM_OFFSET = 20; // Offset from bottom edge of the screen
        const BASE_OFFSET = BOTTOM_OFFSET + MAIN_BUTTON_SIZE - BUTTON_SIZE; // Space between main button and vertical buttons

        // Button configuration - this can be modified to add more buttons or change their properties (title, label, etc.)
        // Simply add or remove more buttons in the verticalButtons and horizontalButtons arrays
        const buttonConfig = {
            mainButton: { id: 'mainButton', label: '+', title: 'Rychlé mapy' },
            verticalButtons: [
                { id: 'verticalButton1', label: '<img src="img/zcu.png">', title: 'Verical button'}, // Example image button
                { id: 'verticalButton2', label: '<img src="icons/arrow.svg">' , title: ''},
                { id: 'verticalButton3', label: '3' , title: ''}
            ],
            horizontalButtons: [
                [
                    { id: 'horizontalButton1A', label: 'A1', url: 'https://example.com/section1/page1', title: 'Horizontal button' },
                    { id: 'horizontalButton2A', label: 'A2', url: 'https://example.com/section1/page2', title: '' },
                    { id: 'horizontalButton3A', label: 'A3', url: 'https://example.com/section1/page3', title: '' }
                ],
                [
                    { id: 'horizontalButton1B', label: 'B1', url: 'https://example.com/section2/page1', title: '' },
                    { id: 'horizontalButton2B', label: 'B2', url: 'https://example.com/section2/page2', title: '' },
                    { id: 'horizontalButton3B', label: 'B3', url: 'https://example.com/section2/page3', title: '' }
                ],
                [
                    { id: 'horizontalButton1C', label: 'C1', url: 'https://example.com/section3/page1', title: '' },
                    { id: 'horizontalButton2C', label: 'C2', url: 'https://example.com/section3/page2', title: '' },
                    { id: 'horizontalButton3C', label: 'C3', url: 'https://example.com/section3/page3', title: '' }
                ]
            ]
        };

        // Styles for the buttons - this can be modified to change the appearance of the buttons
        // You can change colors, sizes, and other properties here
        const style = document.createElement('style');
        style.textContent = `
            body {
                font-family: Arial, sans-serif;
            }
            .main-button {
                position: fixed;
                bottom: ${BOTTOM_OFFSET}px;
                right: ${RIGHT_OFFSET}px;
                width: ${MAIN_BUTTON_SIZE}px;
                height: ${MAIN_BUTTON_SIZE}px;
                background-color: #3498db;
                border-radius: 12px;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                border: none;
                font-size: 24px;
                transition: background-color 0.3s;
            }
            .main-button:hover {
                background-color: #2980b9;
            }
            .vertical-button, .horizontal-button {
                position: fixed;
                width: ${BUTTON_SIZE}px;
                height: ${BUTTON_SIZE}px;
                border-radius: 12px;
                color: white;
                display: none;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                border: none;
                font-size: 20px;
                transition: all 0.3s;
            }
            .vertical-button {
                background-color: #e74c3c;
                z-index: 999;
            }
            .vertical-button:hover {
                background-color: #c0392b;
            }
            .horizontal-button {
                background-color: #2ecc71;
                z-index: 998;
            }
            .horizontal-button:hover {
                background-color: #27ae60;
            }
            .vertical-button img, .horizontal-button img {
                width: 90%;
                height: 90%;
                object-fit: contain;
            }
            .vertical-button img:hover {
                background-color:rgb(43, 162, 192);
            }
        `;
        shadow.appendChild(style);

        // HTML structure
        const container = document.createElement('div');
        container.innerHTML = `
            <button class="main-button" id="${buttonConfig.mainButton.id}" title="${buttonConfig.mainButton.title}">
                ${buttonConfig.mainButton.label}
            </button>
            ${buttonConfig.verticalButtons.map(button => `
                <button class="vertical-button" id="${button.id}" title="${button.title}">${button.label}</button>
            `).join('')}
            ${buttonConfig.horizontalButtons.flat().map(button => `
                <button class="horizontal-button" id="${button.id}" title="${button.title}">${button.label}</button>
            `).join('')}
        `;
        shadow.appendChild(container);

        // Script logic
        const mainButton = container.querySelector(`#${buttonConfig.mainButton.id}`);
        const verticalButtons = buttonConfig.verticalButtons.map(button => container.querySelector(`#${button.id}`));
        const horizontalButtonSets = buttonConfig.horizontalButtons.map(set =>
            set.map(button => container.querySelector(`#${button.id}`))
        );
        const allHorizontalButtons = horizontalButtonSets.flat();

        let activeVerticalButtonIndex = -1;
        let verticalButtonsVisible = false;

        // Helper function to set initial styles
        function setInitialStyles() {
            verticalButtons.forEach(button => {
                button.style.transform = 'translateY(50px)';
                button.style.opacity = '0';
                button.style.display = 'none';
            });
            allHorizontalButtons.forEach(button => {
                button.style.transform = 'translateX(50px)';
                button.style.opacity = '0';
                button.style.display = 'none';
            });
        }

        // Helper function to animate buttons
        function animateButtons(buttons, transform, opacity, display = 'none', delay = 0) {
            buttons.forEach((button, index) => {
                button.style.display = display;
                setTimeout(() => {
                    button.style.transform = transform;
                    button.style.opacity = opacity;
                }, index * delay);
            });
        }

        // Helper function to position buttons
        function positionButtons(buttons, basePosition, spacing, isVertical = true) {
            buttons.forEach((button, index) => {
                if (isVertical) {
                    button.style.right = `${RIGHT_OFFSET + VERTICAL_OFFSET}px`;
                    button.style.bottom = `${BASE_OFFSET + spacing * (index + 1)}px`;
                } else {
                    button.style.bottom = `${basePosition.bottom}px`;
                    button.style.right = `${RIGHT_OFFSET + VERTICAL_OFFSET + spacing * (index + 1)}px`;
                }
                button.style.display = 'flex';
            });
        }

        function hideAllExceptMain() {
            animateButtons(verticalButtons, 'translateY(50px)', '0', 'none');
            animateButtons(allHorizontalButtons, 'translateX(50px)', '0', 'none');
            activeVerticalButtonIndex = -1;
            verticalButtonsVisible = false;
        }

        // Show vertical buttons when main button is clicked
        mainButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (verticalButtonsVisible) return;

            hideAllExceptMain();
            const mainButtonPosition = mainButton.getBoundingClientRect();
            positionButtons(verticalButtons, mainButtonPosition, SPACING);
            animateButtons(verticalButtons, 'translateY(0)', '1', 'flex', 100);
            verticalButtonsVisible = true;
        });

        // Show horizontal buttons when vertical button is clicked
        verticalButtons.forEach((verticalButton, vIndex) => {
            verticalButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (activeVerticalButtonIndex === vIndex) return;

                activeVerticalButtonIndex = vIndex;
                animateButtons(allHorizontalButtons, 'translateX(50px)', '0', 'none');

                const verticalButtonPosition = verticalButton.getBoundingClientRect();
                const distanceFromBottom = window.innerHeight - verticalButtonPosition.top - verticalButtonPosition.height;
                positionButtons(horizontalButtonSets[vIndex], { bottom: distanceFromBottom }, SPACING, false);
                animateButtons(horizontalButtonSets[vIndex], 'translateX(0)', '1', 'flex', 100);
            });
        });

        // Handle horizontal button clicks
        allHorizontalButtons.forEach((button, index) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const url = buttonConfig.horizontalButtons.flat()[index].url;
                window.open(url, '_blank'); // Open the link in a new tab
                // window.location.href = url; // Redirect to the URL
            });
        });

        // Hide all buttons on mousedown
        document.addEventListener('mousedown', (event) => {
            if (!verticalButtonsVisible) return;
            const path = event.composedPath();
            if (!path.includes(container)) {
                animateButtons(verticalButtons, 'translateY(50px)', '0');
                animateButtons(allHorizontalButtons, 'translateX(50px)', '0');
                setTimeout(hideAllExceptMain, 200);
            }
        });

        setInitialStyles();
    }
}

customElements.define('gis-floating-buttons', FloatingButtons);
